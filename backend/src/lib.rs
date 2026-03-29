use std::f64::consts::PI;
use hifitime::prelude::*;
use hifitime::UNIX_REF_EPOCH;
use serde_json::json;
use worker::*;

// ============================
// TCL (Lunar Coordinate Time) — Ashby & Patla (2024), arXiv:2402.11150
//
// hifitime covers: TAI, TT, ET, TDB, UTC, GPST, GST, BDT, QZSST.
// TCL has no standard library; Keplerian model used here — future: replace
// with anise ephemeris for proper Earth–Moon distance.
// ============================

// Lunar clock secular rate relative to geocentric time, µs/day
const RATE_M: f64 = 56.0199;
/// Unix ms at J2000.0 (2000-01-01T11:58:55.816Z)
const J2000_MS: f64 = 946_728_000_000.0;
/// Unix ms of reference lunar perigee (2024-01-13T10:35Z)
const PERIGEE_MS: f64 = 1_705_142_100_000.0;
/// Sidereal month in seconds
const T_SID_S: f64 = 27.321661 * 86_400.0;
/// Mean lunar orbital eccentricity
const E_MOON: f64 = 0.0549;

/// Solve Kepler's equation; return true anomaly (radians) for `utc_ms`.
fn true_anomaly(utc_ms: f64) -> f64 {
    let elapsed_s = (utc_ms - PERIGEE_MS) / 1000.0;
    let mean_anom = 2.0 * PI * elapsed_s / T_SID_S;
    let mut ecc_anom = mean_anom;
    for _ in 0..8 {
        ecc_anom = mean_anom + E_MOON * ecc_anom.sin();
    }
    2.0 * f64::atan2(
        (1.0 + E_MOON).sqrt() * (ecc_anom / 2.0).sin(),
        (1.0 - E_MOON).sqrt() * (ecc_anom / 2.0).cos(),
    )
}

/// TCL drift in µs since J2000, with first-order eccentricity correction.
fn lunar_drift_us(utc_ms: f64) -> f64 {
    let ta = true_anomaly(utc_ms);
    let days = (utc_ms - J2000_MS) / 86_400_000.0;
    let osc = E_MOON * ta.sin() * RATE_M * T_SID_S / (2.0 * PI * 86_400.0);
    RATE_M * days + osc
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_true_anomaly_at_perigee() {
        let ta = true_anomaly(PERIGEE_MS);
        assert!((ta - 0.0).abs() < 1e-10, "At perigee, true anomaly should be ~0");
    }

    #[test]
    fn test_true_anomaly_returns_valid_range() {
        let ta = true_anomaly(PERIGEE_MS + T_SID_S * 1000.0);
        assert!(ta >= 0.0 && ta <= 2.0 * PI, "True anomaly should be in [0, 2π)");
    }

    #[test]
    fn test_true_anomaly_deterministic() {
        let t = PERIGEE_MS;
        let ta1 = true_anomaly(t);
        let ta2 = true_anomaly(t);
        assert!((ta1 - ta2).abs() < 1e-15, "True anomaly should be deterministic");
    }

    #[test]
    fn test_lunar_drift_increases_with_time() {
        let drift1 = lunar_drift_us(J2000_MS);
        let drift2 = lunar_drift_us(J2000_MS + 86_400_000.0);
        assert!(drift2 > drift1, "Lunar drift should increase with time");
    }

    #[test]
    fn test_lunar_drift_order_of_magnitude() {
        let now = PERIGEE_MS;
        let drift = lunar_drift_us(now);
        let days = (now - J2000_MS) / 86_400_000.0;
        let expected_rate = RATE_M * days;
        let osc_amplitude = E_MOON * RATE_M;
        let expected_range = (expected_rate - osc_amplitude)..(expected_rate + osc_amplitude);
        assert!(
            expected_range.contains(&drift),
            "Drift should be within secular rate ± oscillation amplitude, got {} (expected ~{})",
            drift,
            expected_rate
        );
    }

    #[test]
    fn test_lunar_drift_deterministic() {
        let t = PERIGEE_MS;
        let drift1 = lunar_drift_us(t);
        let drift2 = lunar_drift_us(t);
        assert!((drift1 - drift2).abs() < 1e-10, "Lunar drift should be deterministic");
    }
}

// ============================
// HTTP handler
// ============================

fn cors_headers() -> Headers {
    let h = Headers::new();
    let _ = h.set("Access-Control-Allow-Origin", "*");
    let _ = h.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    let _ = h.set("Access-Control-Max-Age", "86400");
    h
}

fn json_headers() -> Headers {
    let h = Headers::new();
    let _ = h.set("Content-Type", "application/json");
    let _ = h.set("Cache-Control", "no-store");
    h
}

fn ok_json(body: &str) -> Response {
    Response::ok(body)
        .unwrap()
        .with_headers(json_headers())
        .with_headers(cors_headers())
}

fn ok_empty() -> Response {
    Response::empty()
        .unwrap()
        .with_status(204)
        .with_headers(cors_headers())
}

#[event(fetch)]
pub async fn main(req: Request, _env: Env, _ctx: Context) -> Result<Response> {
    let url = req.url()?;
    let path = url.path();

    // CORS preflight
    if req.method() == Method::Options {
        return Ok(ok_empty());
    }

    if path == "/api/health" && req.method() == Method::Get {
        return Ok(ok_json(&json!({"ok": true}).to_string()));
    }

    if path == "/api/time" && req.method() == Method::Get {
        let server_ms = js_sys::Date::now();
        let epoch = Epoch::from_unix_seconds(server_ms / 1000.0);

        // TAI
        let tai_epoch = epoch.to_time_scale(TimeScale::TAI);
        let tai_ms =
            (tai_epoch.duration - UNIX_REF_EPOCH.duration).to_unit(Unit::Millisecond);

        // TDB (Barycentric Dynamical Time)
        // Note: TDB ≠ TCB. TDB is rescaled so Earth clocks show no secular drift;
        // TCB has a secular L_B drift from TT (~1.55e-8 s/s).
        let tdb_epoch = epoch.to_time_scale(TimeScale::TDB);
        let tdb_ms =
            (tdb_epoch.duration - UNIX_REF_EPOCH.duration).to_unit(Unit::Millisecond);

        // GPS week / time-of-week
        let gpst = epoch.to_time_scale(TimeScale::GPST);
        let gps_seconds = gpst.duration.to_seconds();
        let gps_week = (gps_seconds / 604_800.0).floor() as i64;
        let gps_tow_s = gps_seconds % 604_800.0;

        // TCL lunar drift
        let tcl_drift = lunar_drift_us(server_ms);

        let body = json!({
            "server_ms": server_ms,
            "tcl_drift_us": tcl_drift,
            "tai_ms": tai_ms,
            "gps_week": gps_week,
            "gps_tow_s": gps_tow_s,
            "tdb_ms": tdb_ms,
        })
        .to_string();

        return Ok(ok_json(&body));
    }

    console_error!("Unknown path: {}", path);
    Response::error("Not Found", 404)
}
