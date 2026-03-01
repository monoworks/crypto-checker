import { NextRequest, NextResponse } from "next/server";
import { fetchFundingRateHistory } from "@/lib/api/binance";
import { getCached, setCache } from "@/lib/cache";
import { HISTORY_CACHE_TTL_MS, FUNDING_PERIODS_PER_YEAR } from "@/lib/constants";
import type { FundingRateHistory, FundingRateHistoryPoint } from "@/types/funding-rate";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  if (!symbol) {
    return NextResponse.json(
      { error: "symbol parameter is required" },
      { status: 400 }
    );
  }

  const cacheKey = `binance:history:${symbol}:${limit}`;

  try {
    const cached = getCached<FundingRateHistory>(cacheKey);
    if (cached) {
      return NextResponse.json({ data: cached, meta: { cached: true } });
    }

    const raw = await fetchFundingRateHistory(symbol, limit);
    const rates: FundingRateHistoryPoint[] = raw.map((item) => {
      const fundingRate = parseFloat(item.fundingRate);
      return {
        fundingRate,
        fundingRatePercent: fundingRate * 100,
        annualizedRate: fundingRate * FUNDING_PERIODS_PER_YEAR * 100,
        timestamp: item.fundingTime,
        markPrice: parseFloat(item.markPrice),
      };
    });

    const history: FundingRateHistory = {
      symbol,
      exchange: "binance",
      rates,
    };

    setCache(cacheKey, history, HISTORY_CACHE_TTL_MS);

    return NextResponse.json(
      { data: history, meta: { cached: false } },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error(`Failed to fetch history for ${symbol}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch funding rate history for ${symbol}` },
      { status: 502 }
    );
  }
}
