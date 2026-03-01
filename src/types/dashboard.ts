import type { FundingRateData, AnomalyLevel } from "./funding-rate";

export type SortField = "symbol" | "fundingRate" | "annualizedRate" | "markPrice";
export type SortDirection = "asc" | "desc";

export interface DashboardState {
  sortField: SortField;
  sortDirection: SortDirection;
  searchQuery: string;
  selectedSymbol: string | null;
  filterLevel: AnomalyLevel | "all";
}

export interface StatsCardData {
  totalSymbols: number;
  extremeCount: number;
  elevatedCount: number;
  mostPositive: FundingRateData | null;
  mostNegative: FundingRateData | null;
  averageRate: number;
}

export interface ApiHealthStatus {
  binance: boolean;
  lastUpdated: number | null;
  cacheAge: number;
}
