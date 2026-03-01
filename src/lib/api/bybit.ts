import type {
  BybitFundingRateResponse,
  BybitFundingRateItem,
} from "@/types/api-responses";
import { BYBIT_BASE } from "@/lib/constants";

// TODO: Phase 2 - Implement Bybit funding rate fetching
export async function fetchBybitFundingHistory(
  symbol: string,
  category: "linear" | "inverse" = "linear",
  limit: number = 200
): Promise<BybitFundingRateItem[]> {
  const url = new URL(`${BYBIT_BASE}/v5/market/funding/history`);
  url.searchParams.set("category", category);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Bybit API error: ${res.status} ${res.statusText}`);
  }

  const data: BybitFundingRateResponse = await res.json();
  if (data.retCode !== 0) {
    throw new Error(`Bybit API error: retCode ${data.retCode}`);
  }

  return data.result.list;
}
