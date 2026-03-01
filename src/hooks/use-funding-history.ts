"use client";

import useSWR from "swr";
import type { FundingRateHistory } from "@/types/funding-rate";

interface HistoryResponse {
  data: FundingRateHistory;
  meta: { cached: boolean };
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  });

export function useFundingHistory(symbol: string | null) {
  const { data, error, isLoading } = useSWR<HistoryResponse>(
    symbol ? `/api/funding-rates/history?symbol=${symbol}&limit=100` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    }
  );

  return {
    history: data?.data ?? null,
    isLoading,
    error,
  };
}
