export const LEAP_SECONDS = 37;
export const UNIX_TAI_OFFSET = 2208988800;
export const LG = 6.969290134e-10;
export const LB = 1.550519768e-8;
export const LL = 0.7e-10;
export const JD0 = 2443144.5003725;
export const GPS_OFFSET = 19;

export function taiFromUtc(utc) {
  return utc + LEAP_SECONDS * 1000;
}

export function ttFromTai(tai) {
  return tai + 32.184 * 1000;
}

export function julianDate(msTT) {
  return msTT / 86400000 + 2440587.5;
}

export function tcgFromTT(msTT) {
  const jd = julianDate(msTT);
  const delta = (jd - JD0) * 86400;
  return msTT + LG * delta * 1000;
}

export function tcbFromTT(msTT) {
  const jd = julianDate(msTT);
  const delta = (jd - JD0) * 86400;
  return msTT + LB * delta * 1000;
}

export function tclFromTT(msTT) {
  const jd = julianDate(msTT);
  const delta = (jd - JD0) * 86400;
  return msTT + LL * delta * 1000;
}

export function gpsFromTai(tai) {
  const gpsSec = tai / 1000 - GPS_OFFSET;
  const week = Math.floor(gpsSec / 604800);
  const secOfWeek = gpsSec % 604800;
  return { week, sec: Math.floor(secOfWeek), nanos: 0 };
}

export function unixFromUtc(utc) {
  return Math.floor(utc / 1000) - UNIX_TAI_OFFSET;
}

export function formatTime(ms) {
  const d = new Date(ms);
  return d.toISOString().slice(11, 23);
}

export function formatSeconds(s) {
  return s.toFixed(6);
}

export function formatISO(ms) {
  const d = new Date(ms);
  return d.toISOString().replace("T", " ").slice(0, 23);
}

export function formatDelta(ms) {
  const sign = ms >= 0 ? "+" : "-";
  return sign + Math.abs(ms).toFixed(6) + " s";
}
