import { NextResponse } from "next/server";
import { fetchPremiumIndex } from "@/lib/api/binance";
import { transformPremiumIndex } from "@/lib/funding-rate-analyzer";
import { getCached, setCache } from "@/lib/cache";
import { CACHE_TTL_MS } from "@/lib/constants";
import type { FundingRateData } from "@/types/funding-rate";

const CACHE_KEY = "binance:premiumIndex";

export async function GET() {
  try {
    const cached = getCached<FundingRateData[]>(CACHE_KEY);
    if (cached) {
      return NextResponse.json({
        data: cached,
        meta: {
          timestamp: Date.now(),
          cached: true,
          source: "binance",
        },
      });
    }

    const raw = await fetchPremiumIndex();
    const data = raw.map(transformPremiumIndex);

    setCache(CACHE_KEY, data, CACHE_TTL_MS);

    return NextResponse.json(
      {
        data,
        meta: {
          timestamp: Date.now(),
          cached: false,
          source: "binance",
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch funding rates:", error);
    return NextResponse.json(
      { error: "Failed to fetch funding rates" },
      { status: 502 }
    );
  }
}
