"use client";

import useSWR from "swr";
import type { FundingRateData } from "@/types/funding-rate";
import { CLIENT_REFRESH_INTERVAL } from "@/lib/constants";

interface FundingRatesResponse {
  data: FundingRateData[];
  meta: {
    timestamp: number;
    cached: boolean;
    source: string;
  };
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  });

export function useFundingRates() {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<FundingRatesResponse>("/api/funding-rates", fetcher, {
      refreshInterval: CLIENT_REFRESH_INTERVAL,
      revalidateOnFocus: true,
      dedupingInterval: 10_000,
    });

  return {
    rates: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}
