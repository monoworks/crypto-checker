"use client";

import { useState, useMemo } from "react";
import { useFundingRates } from "@/hooks/use-funding-rates";
import { useCountdown } from "@/hooks/use-countdown";
import { StatsCards } from "./stats-cards";
import { SymbolSearch } from "./symbol-search";
import { RefreshIndicator } from "./refresh-indicator";
import { FundingRateTable } from "./funding-rate-table";
import { HistoryChart } from "./history-chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { SortField, SortDirection } from "@/types/dashboard";
import type { AnomalyLevel } from "@/types/funding-rate";

export function DashboardShell() {
  const { rates, isLoading, isValidating, error, refresh } = useFundingRates();
  const { secondsLeft, reset } = useCountdown();

  const [sortField, setSortField] = useState<SortField>("fundingRate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<AnomalyLevel | "all">("all");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleRefresh = () => {
    refresh();
    reset();
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...rates];

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toUpperCase();
      result = result.filter((r) => r.symbol.includes(q));
    }

    // Filter by anomaly level
    if (filterLevel !== "all") {
      result = result.filter((r) => r.anomalyLevel === filterLevel);
    }

    // Sort
    result.sort((a, b) => {
      let cmp: number;
      switch (sortField) {
        case "symbol":
          cmp = a.symbol.localeCompare(b.symbol);
          break;
        case "fundingRate":
          cmp = Math.abs(b.fundingRate) - Math.abs(a.fundingRate);
          break;
        case "annualizedRate":
          cmp = Math.abs(b.annualizedRate) - Math.abs(a.annualizedRate);
          break;
        case "markPrice":
          cmp = b.markPrice - a.markPrice;
          break;
        default:
          cmp = 0;
      }
      return sortDirection === "asc" ? -cmp : cmp;
    });

    return result;
  }, [rates, searchQuery, filterLevel, sortField, sortDirection]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-destructive">Failed to load funding rates</p>
        <button
          onClick={handleRefresh}
          className="text-sm text-primary underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
      ) : (
        <StatsCards rates={rates} />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SymbolSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterLevel={filterLevel}
          onFilterChange={setFilterLevel}
        />
        <RefreshIndicator
          secondsLeft={secondsLeft}
          isValidating={isValidating}
          onRefresh={handleRefresh}
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px]" />
      ) : (
        <FundingRateTable
          rates={filteredAndSorted}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onSelectSymbol={setSelectedSymbol}
          selectedSymbol={selectedSymbol}
        />
      )}

      {selectedSymbol && (
        <HistoryChart
          symbol={selectedSymbol}
          onClose={() => setSelectedSymbol(null)}
        />
      )}
    </div>
  );
}
