export type AnomalyLevel = "normal" | "elevated" | "extreme";
export type SymbolTier = "major" | "midcap" | "micro";

export interface FundingRateData {
  symbol: string;
  exchange: "binance" | "bybit" | "okx";
  fundingRate: number;           // Raw rate as decimal (e.g., 0.0001)
  fundingRatePercent: number;    // As percentage (e.g., 0.01)
  annualizedRate: number;        // Annualized percentage
  markPrice: number;
  indexPrice: number;
  nextFundingTime: number;       // Unix ms
  timestamp: number;             // Unix ms
  anomalyLevel: AnomalyLevel;
  symbolTier: SymbolTier;
}

export interface FundingRateHistory {
  symbol: string;
  exchange: string;
  rates: FundingRateHistoryPoint[];
}

export interface FundingRateHistoryPoint {
  fundingRate: number;
  fundingRatePercent: number;
  annualizedRate: number;
  timestamp: number;
  markPrice: number;
}
