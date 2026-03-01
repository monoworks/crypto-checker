import type {
  OkxFundingRateResponse,
  OkxFundingRateItem,
} from "@/types/api-responses";
import { OKX_BASE } from "@/lib/constants";

// TODO: Phase 2 - Implement OKX funding rate fetching
export async function fetchOkxFundingRate(
  instId: string
): Promise<OkxFundingRateItem[]> {
  const url = new URL(`${OKX_BASE}/api/v5/public/funding-rate`);
  url.searchParams.set("instId", instId);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`OKX API error: ${res.status} ${res.statusText}`);
  }

  const data: OkxFundingRateResponse = await res.json();
  if (data.code !== "0") {
    throw new Error(`OKX API error: ${data.msg}`);
  }

  return data.data;
}
