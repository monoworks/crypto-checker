import type { BinancePremiumIndexItem, BinanceFundingRateItem } from "@/types/api-responses";
import { BINANCE_FUTURES_BASE } from "@/lib/constants";

export async function fetchPremiumIndex(): Promise<BinancePremiumIndexItem[]> {
  const res = await fetch(`${BINANCE_FUTURES_BASE}/fapi/v1/premiumIndex`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`Binance API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchFundingRateHistory(
  symbol: string,
  limit: number = 100
): Promise<BinanceFundingRateItem[]> {
  const url = new URL(`${BINANCE_FUTURES_BASE}/fapi/v1/fundingRate`);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("limit", String(limit));
  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`Binance history API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
