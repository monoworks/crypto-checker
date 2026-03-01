// Anomaly Thresholds (per 8-hour funding period)
// Values are in decimal form (0.0003 = 0.03%)
export const THRESHOLDS = {
  major: {
    elevated: 0.0003,   // ±0.03%
    extreme: 0.0005,    // ±0.05%
  },
  midcap: {
    elevated: 0.0005,   // ±0.05%
    extreme: 0.001,     // ±0.10%
  },
  micro: {
    elevated: 0.001,    // ±0.10%
    extreme: 0.002,     // ±0.20%
  },
} as const;

export const MAJOR_SYMBOLS = ["BTCUSDT", "ETHUSDT"] as const;

export const MIDCAP_SYMBOLS = [
  "BNBUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT",
  "AVAXUSDT", "DOTUSDT", "LINKUSDT", "MATICUSDT", "LTCUSDT",
  "UNIUSDT", "ATOMUSDT", "NEARUSDT", "AAVEUSDT", "MKRUSDT",
] as const;

export const CACHE_TTL_MS = 30_000;
export const HISTORY_CACHE_TTL_MS = 300_000;
export const CLIENT_REFRESH_INTERVAL = 30_000;
export const FUNDING_PERIODS_PER_DAY = 3;
export const FUNDING_PERIODS_PER_YEAR = 1095; // 365 * 3

export const BINANCE_FUTURES_BASE = "https://fapi.binance.com";
export const BYBIT_BASE = "https://api.bybit.com";
export const OKX_BASE = "https://www.okx.com";
