import { describe, it, expect } from "vitest";
import type { BinancePremiumIndexItem } from "@/types/api-responses";
import type { FundingRateData } from "@/types/funding-rate";
import {
  classifySymbolTier,
  detectAnomalyLevel,
  transformPremiumIndex,
  computeStats,
} from "../funding-rate-analyzer";

// Mock data
const mockBinanceItem: BinancePremiumIndexItem = {
  symbol: "BTCUSDT",
  markPrice: "87000.12345678",
  indexPrice: "87010.50000000",
  estimatedSettlePrice: "87005.00000000",
  lastFundingRate: "0.00010000",
  interestRate: "0.00010000",
  nextFundingTime: 1709280000000,
  time: 1709251200000,
};

describe("classifySymbolTier", () => {
  it("classifies BTC as major", () => {
    expect(classifySymbolTier("BTCUSDT")).toBe("major");
  });

  it("classifies ETH as major", () => {
    expect(classifySymbolTier("ETHUSDT")).toBe("major");
  });

  it("classifies SOL as midcap", () => {
    expect(classifySymbolTier("SOLUSDT")).toBe("midcap");
  });

  it("classifies XRP as midcap", () => {
    expect(classifySymbolTier("XRPUSDT")).toBe("midcap");
  });

  it("classifies unknown token as micro", () => {
    expect(classifySymbolTier("BERAUSDT")).toBe("micro");
  });

  it("classifies PEPEUSDT as micro", () => {
    expect(classifySymbolTier("PEPEUSDT")).toBe("micro");
  });
});

describe("detectAnomalyLevel", () => {
  // Major tier thresholds: elevated=0.0003, extreme=0.0005
  describe("major tier", () => {
    it("returns normal for rate within threshold", () => {
      expect(detectAnomalyLevel(0.0001, "major")).toBe("normal");
    });

    it("returns elevated for rate at elevated threshold", () => {
      expect(detectAnomalyLevel(0.0003, "major")).toBe("elevated");
    });

    it("returns elevated for negative rate at threshold", () => {
      expect(detectAnomalyLevel(-0.0004, "major")).toBe("elevated");
    });

    it("returns extreme for rate at extreme threshold", () => {
      expect(detectAnomalyLevel(0.0005, "major")).toBe("extreme");
    });

    it("returns extreme for rate above extreme threshold", () => {
      expect(detectAnomalyLevel(-0.001, "major")).toBe("extreme");
    });
  });

  // Midcap tier thresholds: elevated=0.0005, extreme=0.001
  describe("midcap tier", () => {
    it("returns normal for typical rate", () => {
      expect(detectAnomalyLevel(0.0002, "midcap")).toBe("normal");
    });

    it("returns elevated at midcap threshold", () => {
      expect(detectAnomalyLevel(0.0005, "midcap")).toBe("elevated");
    });

    it("returns extreme at midcap extreme threshold", () => {
      expect(detectAnomalyLevel(-0.001, "midcap")).toBe("extreme");
    });
  });

  // Micro tier thresholds: elevated=0.001, extreme=0.002
  describe("micro tier", () => {
    it("returns normal for typical rate", () => {
      expect(detectAnomalyLevel(0.0005, "micro")).toBe("normal");
    });

    it("returns elevated at micro threshold", () => {
      expect(detectAnomalyLevel(0.001, "micro")).toBe("elevated");
    });

    it("returns extreme for BERA-level rate", () => {
      expect(detectAnomalyLevel(-0.05, "micro")).toBe("extreme");
    });
  });
});

describe("transformPremiumIndex", () => {
  it("transforms Binance data to FundingRateData", () => {
    const result = transformPremiumIndex(mockBinanceItem);

    expect(result.symbol).toBe("BTCUSDT");
    expect(result.exchange).toBe("binance");
    expect(result.fundingRate).toBeCloseTo(0.0001);
    expect(result.fundingRatePercent).toBeCloseTo(0.01);
    // Annualized: 0.0001 * 1095 * 100 = 10.95
    expect(result.annualizedRate).toBeCloseTo(10.95);
    expect(result.markPrice).toBeCloseTo(87000.12345678);
    expect(result.indexPrice).toBeCloseTo(87010.5);
    expect(result.nextFundingTime).toBe(1709280000000);
    expect(result.timestamp).toBe(1709251200000);
    expect(result.symbolTier).toBe("major");
    expect(result.anomalyLevel).toBe("normal");
  });

  it("detects extreme anomaly for high funding rate", () => {
    const extremeItem: BinancePremiumIndexItem = {
      ...mockBinanceItem,
      symbol: "BERAUSDT",
      lastFundingRate: "-0.05000000",
    };
    const result = transformPremiumIndex(extremeItem);

    expect(result.anomalyLevel).toBe("extreme");
    expect(result.symbolTier).toBe("micro");
    expect(result.annualizedRate).toBeCloseTo(-5475);
  });

  it("correctly identifies elevated for midcap token", () => {
    const elevatedItem: BinancePremiumIndexItem = {
      ...mockBinanceItem,
      symbol: "SOLUSDT",
      lastFundingRate: "0.00060000",
    };
    const result = transformPremiumIndex(elevatedItem);

    expect(result.anomalyLevel).toBe("elevated");
    expect(result.symbolTier).toBe("midcap");
  });
});

describe("computeStats", () => {
  const mockRates: FundingRateData[] = [
    {
      symbol: "BTCUSDT",
      exchange: "binance",
      fundingRate: 0.0001,
      fundingRatePercent: 0.01,
      annualizedRate: 10.95,
      markPrice: 87000,
      indexPrice: 87010,
      nextFundingTime: 1709280000000,
      timestamp: 1709251200000,
      anomalyLevel: "normal",
      symbolTier: "major",
    },
    {
      symbol: "ETHUSDT",
      exchange: "binance",
      fundingRate: -0.0005,
      fundingRatePercent: -0.05,
      annualizedRate: -54.75,
      markPrice: 3200,
      indexPrice: 3201,
      nextFundingTime: 1709280000000,
      timestamp: 1709251200000,
      anomalyLevel: "extreme",
      symbolTier: "major",
    },
    {
      symbol: "SOLUSDT",
      exchange: "binance",
      fundingRate: 0.0006,
      fundingRatePercent: 0.06,
      annualizedRate: 65.7,
      markPrice: 150,
      indexPrice: 150.5,
      nextFundingTime: 1709280000000,
      timestamp: 1709251200000,
      anomalyLevel: "elevated",
      symbolTier: "midcap",
    },
  ];

  it("counts total symbols", () => {
    const stats = computeStats(mockRates);
    expect(stats.totalSymbols).toBe(3);
  });

  it("counts extreme alerts", () => {
    const stats = computeStats(mockRates);
    expect(stats.extremeCount).toBe(1);
  });

  it("counts elevated alerts", () => {
    const stats = computeStats(mockRates);
    expect(stats.elevatedCount).toBe(1);
  });

  it("finds most positive funding rate", () => {
    const stats = computeStats(mockRates);
    expect(stats.mostPositive?.symbol).toBe("SOLUSDT");
  });

  it("finds most negative funding rate", () => {
    const stats = computeStats(mockRates);
    expect(stats.mostNegative?.symbol).toBe("ETHUSDT");
  });

  it("calculates average rate", () => {
    const stats = computeStats(mockRates);
    const expectedAvg = (0.0001 + -0.0005 + 0.0006) / 3;
    expect(stats.averageRate).toBeCloseTo(expectedAvg);
  });

  it("handles empty array", () => {
    const stats = computeStats([]);
    expect(stats.totalSymbols).toBe(0);
    expect(stats.extremeCount).toBe(0);
    expect(stats.mostPositive).toBeNull();
    expect(stats.mostNegative).toBeNull();
    expect(stats.averageRate).toBe(0);
  });
});
