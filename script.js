// ============================
// constants
// ============================

const LEAP_SECONDS = 37;
const UNIX_TAI_OFFSET = 2208988800;
const LG = 6.969290134e-10;
const LB = 1.550519768e-8;
const LL = 0.7e-10;
const JD0 = 2443144.5003725;
const GPS_OFFSET = 19;

const CLOCK_RESOLUTION = 1e-6;
const PRECISION_DIGITS = 6;

// ============================
// time scale functions
// ============================

function el(id) {
  return document.getElementById(id);
}

function utcNow() {
  return Date.now();
}

function taiFromUtc(utc) {
  return utc + LEAP_SECONDS * 1000;
}

function ttFromTai(tai) {
  return tai + 32.184 * 1000;
}

function julianDate(msTT) {
  return (msTT / 86400000) + 2440587.5;
}

function tcgFromTT(msTT) {
  const jd = julianDate(msTT);
  const delta = (jd - JD0) * 86400;
  return msTT + LG * delta * 1000;
}

function tcbFromTT(msTT) {
  const jd = julianDate(msTT);
  const delta = (jd - JD0) * 86400;
  return msTT + LB * delta * 1000;
}

function tclFromTT(msTT) {
  const jd = julianDate(msTT);
  const delta = (jd - JD0) * 86400;
  return msTT + LL * delta * 1000;
}

function gpsFromTai(tai) {
  const gpsSec = (tai / 1000) - GPS_OFFSET;
  const week = Math.floor(gpsSec / 604800);
  const secOfWeek = gpsSec % 604800;
  return { week, sec: Math.floor(secOfWeek), nanos: 0 };
}

function unixFromUtc(utc) {
  return Math.floor(utc / 1000) - UNIX_TAI_OFFSET;
}

// ============================
// format helpers
// ============================

function formatTime(ms) {
  const d = new Date(ms);
  return d.toISOString().slice(11, 23);
}

function formatSeconds(s) {
  return s.toFixed(PRECISION_DIGITS);
}

function formatISO(ms) {
  const d = new Date(ms);
  return d.toISOString().replace("T", " ").slice(0, 23);
}

function formatDelta(ms) {
  const sign = ms >= 0 ? "+" : "-";
  return sign + Math.abs(ms).toFixed(PRECISION_DIGITS) + " s";
}

// ============================
// UI scale control
// ============================

const ATOMIC_KEYS = ["utc", "tai", "gps", "unix"];
const COORD_KEYS = ["tcb", "tcg", "tcl"];

let currentAtomicScale = localStorage.getItem("atomicScale") || "utc";
let currentCoordScale = localStorage.getItem("coordScale") || "tcl";

window.setAtomicFmt = function (i) {
  currentAtomicScale = ATOMIC_KEYS[i];
  localStorage.setItem("atomicScale", currentAtomicScale);
  
  const atomicBtns = document.querySelectorAll("#atomic-selector .scale-btn");
  atomicBtns.forEach((btn, idx) => {
    btn.classList.toggle("on", idx === i);
  });
  const atomicLeds = document.querySelectorAll("#atomic-selector .scale-led");
  atomicLeds.forEach((led, idx) => {
    led.classList.toggle("active", idx === i);
  });
};

window.setCoordFmt = function (i) {
  currentCoordScale = COORD_KEYS[i];
  localStorage.setItem("coordScale", currentCoordScale);
  
  const coordBtns = document.querySelectorAll("#coord-selector .scale-btn");
  coordBtns.forEach((btn, idx) => {
    btn.classList.toggle("on", idx === i);
  });
  const coordLeds = document.querySelectorAll("#coord-selector .scale-led");
  coordLeds.forEach((led, idx) => {
    led.classList.toggle("active", idx === i);
  });
};

// ============================
// Scale colors
// ============================

const SCALE_COLORS = {
  tcb: "#ffaa00",
  tcg: "#33ff66",
  tcl: "#00ddff",
  tai: "#33ff66",
  utc: "#cc66ff",
  gps: "#ff1a1a",
  unix: "#cccccc",
};

const SCALE_INFO = {
  tcb: "Barycentric Coordinate Time",
  tcg: "Geocentric Coordinate Time",
  tcl: "Lunar Coordinate Time",
  tai: "International Atomic Time",
  utc: "Coordinated Universal Time",
  gps: "GPS Time",
  unix: "UNIX / POSIX",
};

// ============================
// network time
// ============================

let networkTimeData = null;

async function fetchNetworkTime() {
  try {
    const t1 = performance.now();
    const t1w = Date.now();
    
    const res = await fetch("https://worldtimeapi.org/api/ip");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const rtt = performance.now() - t1;
    
    const apiTime = new Date(j.utc_datetime).getTime();
    const offsetSec = (t1w + rtt / 2 - apiTime) / 1000;
    
    networkTimeData = {
      deviation: offsetSec,
      rtt,
      lastUpdate: Date.now()
    };
  } catch (e) {
    console.warn("Network time fetch failed:", e);
  }
}

// ============================
// render loop
// ============================

function render() {
  const sysTime = Date.now();
  const realTime = networkTimeData
    ? sysTime - networkTimeData.deviation * 1000
    : sysTime;
  
  const utc = realTime;
  const tai = taiFromUtc(utc);
  const tt = ttFromTai(tai);
  
  const tcg = tcgFromTT(tt);
  const tcb = tcbFromTT(tt);
  const tcl = tclFromTT(tt);
  
  const gps = gpsFromTai(tai);
  const unix = unixFromUtc(utc);
  
  // Render atomic clock
  const tvalAtomic = el("tval-atomic");
  const snameAtomic = el("sname-atomic");
  
  if (tvalAtomic) {
    const sc = SCALE_COLORS[currentAtomicScale];
    tvalAtomic.style.color = sc;
    tvalAtomic.style.textShadow = `0 0 8px ${sc},0 0 20px ${sc}40`;
    
    let displayValue;
    switch (currentAtomicScale) {
      case "tai":
        displayValue = formatISO(tai);
        snameAtomic.textContent = SCALE_INFO.tai;
        break;
      case "utc":
        displayValue = formatISO(utc);
        snameAtomic.textContent = SCALE_INFO.utc;
        break;
      case "gps":
        displayValue = `W${gps.week} ${gps.sec}s`;
        snameAtomic.textContent = SCALE_INFO.gps;
        break;
      case "unix":
        displayValue = unix;
        snameAtomic.textContent = SCALE_INFO.unix;
        break;
    }
    tvalAtomic.textContent = displayValue;
    snameAtomic.style.color = sc;
  }
  
  // Render coordinate clock
  const tvalCoord = el("tval-coord");
  const snameCoord = el("sname-coord");
  
  if (tvalCoord) {
    const sc = SCALE_COLORS[currentCoordScale];
    tvalCoord.style.color = sc;
    tvalCoord.style.textShadow = `0 0 8px ${sc},0 0 20px ${sc}40`;
    
    let displayValue;
    switch (currentCoordScale) {
      case "tcb":
        displayValue = formatSeconds(tcb / 1000) + " s";
        snameCoord.textContent = SCALE_INFO.tcb;
        break;
      case "tcg":
        displayValue = formatSeconds(tcg / 1000) + " s";
        snameCoord.textContent = SCALE_INFO.tcg;
        break;
      case "tcl":
        displayValue = formatSeconds(tcl / 1000) + " s";
        snameCoord.textContent = SCALE_INFO.tcl;
        break;
    }
    tvalCoord.textContent = displayValue;
    snameCoord.style.color = sc;
    
    // Show citation for Lunar time
    const citationEl = el("scale-citation-coord");
    if (citationEl) {
      if (currentCoordScale === "tcl") {
        citationEl.innerHTML = 'Ashby & Patla (2024) — <a href="https://arxiv.org/abs/2402.11150" target="_blank" rel="noopener" style="color: #666;">arXiv:2402.11150</a>';
      } else {
        citationEl.textContent = "";
      }
    }
  }
  
  // Delta display
  const deltaEl = el("delta-val");
  if (deltaEl) {
    let coordTime, atomicTime;
    switch (currentCoordScale) {
      case "tcb": coordTime = tcb; break;
      case "tcg": coordTime = tcg; break;
      case "tcl": coordTime = tcl; break;
    }
    switch (currentAtomicScale) {
      case "tai": atomicTime = tai; break;
      case "utc": atomicTime = utc; break;
      case "gps": atomicTime = tai - GPS_OFFSET * 1000; break;
      case "unix": atomicTime = unix * 1000; break;
    }
    const delta = (coordTime - atomicTime) / 1000;
    deltaEl.textContent = formatDelta(delta);
  }
  
  // Network diagnostics
  updateDeviationDisplay();
  
  requestAnimationFrame(render);
}

// ============================
// network diagnostics display
// ============================

const HALF_MINI = 12;
const MINI_SEGS = 24;
const MAX_DEV = 1.0;
const WARN_S = 0.25;
const ERR_S = 1.0;

function miniSegColor(dist) {
  if (dist < 4) return "-green";
  if (dist < 8) return "-amber";
  return "-red";
}

function updateDeviationDisplay() {
  if (!networkTimeData) return;
  
  const suffixes = ["system", "timeapi", "cloudflare"];
  
  suffixes.forEach((sfx, i) => {
    const offEl = el("off-" + sfx);
    if (!offEl) return;
    
    let offset = 0;
    if (sfx === "system") {
      offset = (Date.now() - networkTimeData.lastUpdate) / 1000;
    }
    
    const sign = offset >= 0 ? "+" : "";
    offEl.textContent = `${sign}${offset.toFixed(3)}s`;
    
    const indicatorEl = el("ind-" + sfx);
    if (indicatorEl) {
      if (Math.abs(offset) > ERR_S) {
        indicatorEl.className = "indicator active error";
      } else if (Math.abs(offset) > WARN_S) {
        indicatorEl.className = "indicator active warning";
      } else {
        indicatorEl.className = "indicator active";
      }
    }
  });
}

// ============================
// startup
// ============================

function initSelectorUI() {
  // Initialize atomic selector UI
  const atomicIdx = ATOMIC_KEYS.indexOf(currentAtomicScale);
  const atomicBtns = document.querySelectorAll("#atomic-selector .scale-btn");
  atomicBtns.forEach((btn, idx) => {
    btn.classList.toggle("on", idx === atomicIdx);
  });
  const atomicLeds = document.querySelectorAll("#atomic-selector .scale-led");
  atomicLeds.forEach((led, idx) => {
    led.classList.toggle("active", idx === atomicIdx);
  });
  
  // Initialize coordinate selector UI
  const coordIdx = COORD_KEYS.indexOf(currentCoordScale);
  const coordBtns = document.querySelectorAll("#coord-selector .scale-btn");
  coordBtns.forEach((btn, idx) => {
    btn.classList.toggle("on", idx === coordIdx);
  });
  const coordLeds = document.querySelectorAll("#coord-selector .scale-led");
  coordLeds.forEach((led, idx) => {
    led.classList.toggle("active", idx === coordIdx);
  });
}

window.addEventListener("load", () => {
  console.log("Epoch clock initialized");
  
  fetchNetworkTime();
  setInterval(fetchNetworkTime, 5000);
  
  initSelectorUI();
  
  render();
});
