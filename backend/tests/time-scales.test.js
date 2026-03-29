import { describe, it, expect } from 'vitest';
import {
  LEAP_SECONDS,
  UNIX_TAI_OFFSET,
  GPS_OFFSET,
  taiFromUtc,
  ttFromTai,
  tcgFromTT,
  tcbFromTT,
  tclFromTT,
  gpsFromTai,
  unixFromUtc,
  formatTime,
  formatSeconds,
  formatISO,
  formatDelta,
} from './time-scales.js';

describe('Leap Second Offset', () => {
  it('adds correct leap second count', () => {
    const utc = 1000;
    const tai = taiFromUtc(utc);
    expect(tai).toBe(1000 + LEAP_SECONDS * 1000);
  });
});

describe('TT from TAI', () => {
  it('adds TT-TAI offset (~32.184s)', () => {
    const tai = 0;
    const tt = ttFromTai(tai);
    expect(tt).toBeCloseTo(32184, 0);
  });
});

describe('GPS from TAI', () => {
  it('subtracts GPS offset', () => {
    const tai = 1000 * GPS_OFFSET;
    const gps = gpsFromTai(tai);
    expect(gps.week).toBe(0);
    expect(gps.sec).toBe(0);
  });

  it('computes week number correctly', () => {
    const tai = 1000 * GPS_OFFSET + 2 * 604800 * 1000;
    const gps = gpsFromTai(tai);
    expect(gps.week).toBe(2);
    expect(gps.sec).toBe(0);
  });
});

describe('UNIX from UTC', () => {
  it('converts Unix epoch correctly', () => {
    const unix = unixFromUtc(UNIX_TAI_OFFSET * 1000);
    expect(unix).toBe(0);
  });

  it('gives positive seconds for dates after epoch', () => {
    const unix = unixFromUtc((UNIX_TAI_OFFSET + 1000) * 1000);
    expect(unix).toBe(1000);
  });
});

describe('Coordinate Time Scale Derivatives', () => {
  it('TCG offset is proportional to time elapsed', () => {
    const tt1 = Date.now();
    const tt2 = tt1 + 86400000; // 1 day later
    const tcg1 = tcgFromTT(tt1);
    const tcg2 = tcgFromTT(tt2);
    expect(tcg2 - tcg1).toBeCloseTo(86400000, 0);
  });

  it('TCB offset is proportional to time elapsed', () => {
    const tt1 = Date.now();
    const tt2 = tt1 + 86400000;
    const tcb1 = tcbFromTT(tt1);
    const tcb2 = tcbFromTT(tt2);
    expect(tcb2 - tcb1).toBeCloseTo(86400000, -2);
  });

  it('TCB rate is larger than TCG rate (LB > LG)', () => {
    const tt = Date.now();
    const tcb_diff = (tcbFromTT(tt) - tt) / tt;
    const tcg_diff = (tcgFromTT(tt) - tt) / tt;
    expect(Math.abs(tcb_diff)).toBeGreaterThan(Math.abs(tcg_diff));
  });

  it('TCL rate is much smaller than TCG rate', () => {
    const tt = Date.now();
    const tcg_diff = Math.abs((tcgFromTT(tt) - tt) / tt);
    const tcl_diff = Math.abs((tclFromTT(tt) - tt) / tt);
    expect(tcl_diff).toBeLessThan(tcg_diff);
  });
});

describe('Formatters', () => {
  describe('formatTime', () => {
    it('extracts HH:MM:SS.mmm from milliseconds', () => {
      const d = new Date('2024-01-01T12:30:45.123Z');
      expect(formatTime(d.getTime())).toBe('12:30:45.123');
    });
  });

  describe('formatISO', () => {
    it('formats as YYYY-MM-DD HH:MM:SS.mmm', () => {
      const d = new Date('2024-01-01T12:30:45.123Z');
      expect(formatISO(d.getTime())).toBe('2024-01-01 12:30:45.123');
    });
  });

  describe('formatSeconds', () => {
    it('formats with 6 decimal places', () => {
      expect(formatSeconds(1.23456789)).toBe('1.234568');
      expect(formatSeconds(-1.23456789)).toBe('-1.234568');
    });
  });

  describe('formatDelta', () => {
    it('adds positive sign', () => {
      expect(formatDelta(1234.5)).toBe('+1234.500000 s');
    });

    it('adds negative sign', () => {
      expect(formatDelta(-1234.5)).toBe('-1234.500000 s');
    });

    it('handles zero', () => {
      expect(formatDelta(0)).toBe('+0.000000 s');
    });
  });
});
