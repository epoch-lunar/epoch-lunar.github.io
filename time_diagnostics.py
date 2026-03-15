#!/usr/bin/env python3
"""
System Time Diagnostics Tool

Displays detailed diagnostics on all time scales reported by the system
and various network time APIs.

Usage:
    python time_diagnostics.py [--continuous]

Options:
    --continuous    Run continuously, refreshing every 5 seconds
"""

import socket
import struct
import time
import datetime
import json
import sys
import argparse
import urllib.request
import urllib.error
from typing import Optional, Dict, Any, List, Tuple

# Constants
NTP_EPOCH = 2208988800  # 1970-01-01 00:00:00 in NTP epoch
J2000 = datetime.datetime(2000, 1, 1, 12, 0, 0, tzinfo=datetime.timezone.utc)
TAI_OFFSET = 37  # Current TAI - UTC offset
GPS_OFFSET = 19  # GPS - TAI offset (GPS = TAI - 19)
TT_TAI = 32.184  # TT - TAI offset
L_B = 1.550519768e-8  # TCB rate coefficient

# Lunar time constants
RATE_M = 56.0199  # Lunar drift rate in microseconds per day
RATE_E = 0.10843417
T_SID = 27.321661 * 86400  # Sidereal month in seconds
E_MOON = 0.0549  # Moon eccentricity


def get_ntp_time(server: str, timeout: float = 5.0) -> Tuple[Optional[float], Optional[float], Optional[str]]:
    """
    Query an NTP server and return (offset, rtt, error_message).
    
    The offset is the local clock correction - positive means local is fast,
    negative means local is slow.
    """
    try:
        client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        client.settimeout(timeout)
        
        # NTP request packet
        data = b'\x1b' + 47 * b'\0'
        
        t1 = time.time()
        client.sendto(data, (server, 123))
        data, _ = client.recvfrom(48)
        t4 = time.time()
        
        client.close()
        
        # Unpack the response
        t = struct.unpack('!12I', data)[10]
        t -= NTP_EPOCH
        
        # Calculate round-trip delay
        # We don't have T2 and T3 from the server, so we approximate
        rtt = (t4 - t1) * 1000  # Convert to milliseconds
        
        # The server time
        server_time = t
        
        # Local time
        local_time = time.time()
        
        # Offset: positive = local is fast, negative = local is slow
        offset = local_time - server_time
        
        return offset, rtt, None
        
    except socket.timeout:
        return None, None, "timeout"
    except Exception as e:
        return None, None, str(e)


def get_worldtimeapi_time() -> Tuple[Optional[datetime.datetime], Optional[float], Optional[str]]:
    """Get time from WorldTimeAPI."""
    try:
        req = urllib.request.Request(
            "https://worldtimeapi.org/api/ip",
            headers={"User-Agent": "TimeDiagnostics/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
        
        # Get the datetime from the response
        dt_str = data["datetime"]
        network_time = datetime.datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
        
        # Get local time
        local_time = datetime.datetime.now(datetime.timezone.utc)
        
        # Calculate offset in seconds
        offset = (local_time - network_time).total_seconds()
        
        return network_time, offset, None
        
    except urllib.error.URLError as e:
        return None, None, f"URL error: {e}"
    except Exception as e:
        return None, None, str(e)


def get_timeapi_io_time() -> Tuple[Optional[datetime.datetime], Optional[float], Optional[str]]:
    """Get time from timeapi.io."""
    try:
        req = urllib.request.Request(
            "https://www.timeapi.io/api/Time/current/zone?timeZone=UTC",
            headers={"User-Agent": "TimeDiagnostics/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
        
        # Parse the datetime - timeapi.io returns ISO format
        dt_str = data["dateTime"]
        network_time = datetime.datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
        
        # Get local time (make it timezone-aware)
        local_time = datetime.datetime.now(datetime.timezone.utc)
        
        # Make network_time timezone-aware if it isn't
        if network_time.tzinfo is None:
            network_time = network_time.replace(tzinfo=datetime.timezone.utc)
        
        # Calculate offset
        offset = (local_time - network_time).total_seconds()
        
        return network_time, offset, None
        
    except urllib.error.URLError as e:
        return None, None, f"URL error: {e}"
    except Exception as e:
        return None, None, str(e)


def calculate_lunar_drift(d: datetime.datetime) -> float:
    """Calculate lunar drift in microseconds since J2000."""
    days = (d.replace(tzinfo=datetime.timezone.utc) - J2000).total_seconds() / 86400
    
    # Simplified calculation
    return days * RATE_M


def calculate_tcb(d: datetime.datetime) -> datetime.datetime:
    """Calculate Barycentric Coordinate Time (TCB)."""
    secs_since_j2000 = (d.replace(tzinfo=datetime.timezone.utc) - J2000).total_seconds()
    tcb_offset = TAI_OFFSET + TT_TAI + L_B * secs_since_j2000
    return d + datetime.timedelta(seconds=tcb_offset)


def get_local_system_time() -> datetime.datetime:
    """Get local system time in UTC."""
    return datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0)


def format_offset(seconds: float) -> str:
    """Format offset with sign."""
    sign = "+" if seconds >= 0 else ""
    return f"{sign}{seconds:.6f} s"


def print_header():
    """Print the header."""
    width = 70
    print("╔" + "═" * (width - 2) + "╗")
    print("║" + " SYSTEM TIME DIAGNOSTICS ".center(width - 2) + "║")
    print("╠" + "═" * (width - 2) + "╣")


def print_section(title: str):
    """Print a section header."""
    print("╠" + "═" * 68 + "╣")
    print(f"║ {title.ljust(66)} ║")


def print_row(label: str, value: str, color: str = ""):
    """Print a data row."""
    # Strip ANSI codes for file output
    clean_value = value
    print(f"║ {label.ljust(28)} : {clean_value.ljust(38)} ║")


def main():
    parser = argparse.ArgumentParser(description="System Time Diagnostics Tool")
    parser.add_argument("--continuous", "-c", action="store_true", 
                        help="Run continuously, refreshing every 5 seconds")
    args = parser.parse_args()
    
    ntp_servers = [
        "pool.ntp.org",
        "time.nist.gov",
        "0.de.pool.ntp.org",
        "1.de.pool.ntp.org",
        "time.google.com",
    ]
    
    while True:
        # Clear screen (optional - works in most terminals)
        # print("\033[2J\033[H", end="")
        
        print_header()
        
        # Get local system time
        local_time = get_local_system_time()
        print_section("LOCAL SYSTEM TIME")
        print_row("Local System UTC", local_time.isoformat())
        
        # Query NTP servers
        print_section("NTP SERVERS")
        ntp_results = []
        
        for server in ntp_servers:
            offset, rtt, error = get_ntp_time(server)
            if error:
                print_row(server, f"ERROR ({error})")
            elif offset is not None and rtt is not None:
                status = "FAST" if offset > 0 else "SLOW"
                print_row(server, f"{format_offset(offset)} ({status}, {rtt:.0f}ms RTT)")
                ntp_results.append((server, offset, rtt))
        
        # Query HTTP APIs
        print_section("HTTP TIME APIS")
        
        # WorldTimeAPI
        wt_time, wt_offset, wt_error = get_worldtimeapi_time()
        if wt_error:
            print_row("worldtimeapi.org", f"ERROR ({wt_error})")
        elif wt_offset is not None:
            status = "FAST" if wt_offset > 0 else "SLOW"
            print_row("worldtimeapi.org", f"{format_offset(wt_offset)} ({status})")
        
        # timeapi.io
        ta_time, ta_offset, ta_error = get_timeapi_io_time()
        if ta_error:
            print_row("timeapi.io", f"ERROR ({ta_error})")
        elif ta_offset is not None:
            status = "FAST" if ta_offset > 0 else "SLOW"
            print_row("timeapi.io", f"{format_offset(ta_offset)} ({status})")
        
        # Calculate average offset from successful queries
        all_offsets = []
        if wt_offset is not None:
            all_offsets.append(wt_offset)
        if ta_offset is not None:
            all_offsets.append(ta_offset)
        for _, offset, _ in ntp_results:
            if offset is not None:
                all_offsets.append(offset)
        
        if all_offsets:
            avg_offset = sum(all_offsets) / len(all_offsets)
            print_section("NETWORK TIME COMPARISON")
            print_row("WorldTimeAPI (UTC)", wt_time.isoformat() if wt_time else "N/A")
            print_row("Local System Time", local_time.isoformat())
            print_row("Average Deviation", f"{format_offset(avg_offset)} ({'FAST' if avg_offset > 0 else 'SLOW'})")
        
        # Time scale comparisons
        print_section("TIME SCALE COMPARISONS")
        
        now = datetime.datetime.now(datetime.timezone.utc)
        
        # UTC
        print_row("UTC", now.isoformat())
        
        # TAI
        tai_time = now + datetime.timedelta(seconds=TAI_OFFSET)
        print_row("TAI", f"{tai_time.isoformat()} (UTC+{TAI_OFFSET}s)")
        
        # GPS
        gps_time = now + datetime.timedelta(seconds=GPS_OFFSET)
        print_row("GPS", f"{gps_time.isoformat()} (UTC+{GPS_OFFSET}s)")
        
        # UNIX epoch
        unix_time = int(now.timestamp())
        print_row("UNIX", f"{unix_time} (seconds since 1970-01-01)")
        
        # Lunar time (TCL - simplified)
        lunar_drift = calculate_lunar_drift(now)
        lunar_time = now + datetime.timedelta(microseconds=lunar_drift)
        print_row("TCL (Lunar)", f"~{lunar_time.isoformat()} (drift: +{lunar_drift:.3f}µs)")
        
        # TCB
        tcb_time = calculate_tcb(now)
        tcb_offset = (tcb_time - now).total_seconds()
        print_row("TCB (Barycentric)", f"~{tcb_time.isoformat()} (UTC+{tcb_offset:.1f}s)")
        
        print("╚" + "═" * 68 + "╝")
        
        if not args.continuous:
            break
        
        print("\nRefreshing in 5 seconds... (Ctrl+C to exit)")
        time.sleep(5)


if __name__ == "__main__":
    main()
