import type { BinancePremiumIndexItem } from "@/types/api-responses";
import type { FundingRateData, AnomalyLevel, SymbolTier } from "@/types/funding-rate";
import type { StatsCardData } from "@/types/dashboard";
import {
  THRESHOLDS,
  MAJOR_SYMBOLS,
  MIDCAP_SYMBOLS,
  FUNDING_PERIODS_PER_YEAR,
} from "@/lib/constants";

export function classifySymbolTier(symbol: string): SymbolTier {
  if ((MAJOR_SYMBOLS as readonly string[]).includes(symbol)) {
    return "major";
  }
  if ((MIDCAP_SYMBOLS as readonly string[]).includes(symbol)) {
    return "midcap";
  }
  return "micro";
}

export function detectAnomalyLevel(rate: number, tier: SymbolTier): AnomalyLevel {
  const absRate = Math.abs(rate);
  const thresholds = THRESHOLDS[tier];
  if (absRate >= thresholds.extreme) {
    return "extreme";
  }
  if (absRate >= thresholds.elevated) {
    return "elevated";
  }
  return "normal";
}

export function transformPremiumIndex(item: BinancePremiumIndexItem): FundingRateData {
  const fundingRate = parseFloat(item.lastFundingRate);
  const markPrice = parseFloat(item.markPrice);
  const indexPrice = parseFloat(item.indexPrice);
  const fundingRatePercent = fundingRate * 100;
  const annualizedRate = fundingRate * FUNDING_PERIODS_PER_YEAR * 100;
  const symbolTier = classifySymbolTier(item.symbol);
  const anomalyLevel = detectAnomalyLevel(fundingRate, symbolTier);

  return {
    symbol: item.symbol,
    exchange: "binance",
    fundingRate,
    fundingRatePercent,
    annualizedRate,
    markPrice,
    indexPrice,
    nextFundingTime: item.nextFundingTime,
    timestamp: item.time,
    symbolTier,
    anomalyLevel,
  };
}

export function computeStats(rates: FundingRateData[]): StatsCardData {
  if (rates.length === 0) {
    return {
      totalSymbols: 0,
      extremeCount: 0,
      elevatedCount: 0,
      mostPositive: null,
      mostNegative: null,
      averageRate: 0,
    };
  }

  let extremeCount = 0;
  let elevatedCount = 0;
  let mostPositive: FundingRateData | null = null;
  let mostNegative: FundingRateData | null = null;
  let sum = 0;

  for (const rate of rates) {
    if (rate.anomalyLevel === "extreme") extremeCount++;
    if (rate.anomalyLevel === "elevated") elevatedCount++;

    if (mostPositive === null || rate.fundingRate > mostPositive.fundingRate) {
      mostPositive = rate;
    }
    if (mostNegative === null || rate.fundingRate < mostNegative.fundingRate) {
      mostNegative = rate;
    }

    sum += rate.fundingRate;
  }

  return {
    totalSymbols: rates.length,
    extremeCount,
    elevatedCount,
    mostPositive,
    mostNegative,
    averageRate: sum / rates.length,
  };
}
