// === Binance ===

/** GET https://fapi.binance.com/fapi/v1/premiumIndex */
export interface BinancePremiumIndexItem {
  symbol: string;            // e.g. "BTCUSDT"
  markPrice: string;         // e.g. "87000.12345678"
  indexPrice: string;        // e.g. "87010.50000000"
  estimatedSettlePrice: string;
  lastFundingRate: string;   // e.g. "-0.00007437"
  interestRate: string;      // e.g. "0.00010000"
  nextFundingTime: number;   // Unix ms
  time: number;              // Unix ms
}

/** GET https://fapi.binance.com/fapi/v1/fundingRate */
export interface BinanceFundingRateItem {
  symbol: string;
  fundingRate: string;
  fundingTime: number;       // Unix ms
  markPrice: string;
}

// === Bybit ===
export interface BybitFundingRateResponse {
  retCode: number;
  result: {
    category: string;
    list: BybitFundingRateItem[];
  };
}

export interface BybitFundingRateItem {
  symbol: string;
  fundingRate: string;
  fundingRateTimestamp: string;
}

// === OKX ===
export interface OkxFundingRateResponse {
  code: string;
  msg: string;
  data: OkxFundingRateItem[];
}

export interface OkxFundingRateItem {
  instId: string;
  instType: string;
  fundingRate: string;
  fundingTime: string;
  nextFundingRate: string;
  nextFundingTime: string;
}
