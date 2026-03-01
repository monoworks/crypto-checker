"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { FundingRateData } from "@/types/funding-rate";
import type { SortField, SortDirection } from "@/types/dashboard";
import {
  formatFundingRate,
  formatAnnualizedRate,
  formatPrice,
  formatCountdown,
} from "@/lib/formatters";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface FundingRateTableProps {
  rates: FundingRateData[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onSelectSymbol: (symbol: string) => void;
  selectedSymbol: string | null;
}

function AnomalyBadge({ level }: { level: string }) {
  switch (level) {
    case "extreme":
      return (
        <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
          Extreme
        </Badge>
      );
    case "elevated":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          Elevated
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          Normal
        </Badge>
      );
  }
}

function SortIcon({ field, currentField, direction }: { field: SortField; currentField: SortField; direction: SortDirection }) {
  if (field !== currentField) return <ArrowUpDown className="ml-1 inline h-3 w-3" />;
  return direction === "asc" ? (
    <ArrowUp className="ml-1 inline h-3 w-3" />
  ) : (
    <ArrowDown className="ml-1 inline h-3 w-3" />
  );
}

function TierBadge({ tier }: { tier: string }) {
  if (tier === "major") return <span className="ml-1 text-[10px] text-blue-400">[M]</span>;
  if (tier === "midcap") return <span className="ml-1 text-[10px] text-purple-400">[MC]</span>;
  return null;
}

export function FundingRateTable({
  rates,
  sortField,
  sortDirection,
  onSort,
  onSelectSymbol,
  selectedSymbol,
}: FundingRateTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => onSort("symbol")}
            >
              Symbol
              <SortIcon field="symbol" currentField={sortField} direction={sortDirection} />
            </TableHead>
            <TableHead
              className="cursor-pointer select-none text-right"
              onClick={() => onSort("fundingRate")}
            >
              Funding Rate
              <SortIcon field="fundingRate" currentField={sortField} direction={sortDirection} />
            </TableHead>
            <TableHead
              className="cursor-pointer select-none text-right"
              onClick={() => onSort("annualizedRate")}
            >
              Annualized
              <SortIcon field="annualizedRate" currentField={sortField} direction={sortDirection} />
            </TableHead>
            <TableHead
              className="cursor-pointer select-none text-right"
              onClick={() => onSort("markPrice")}
            >
              Mark Price
              <SortIcon field="markPrice" currentField={sortField} direction={sortDirection} />
            </TableHead>
            <TableHead className="text-right">Next Funding</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            rates.map((rate) => {
              const rateColor = rate.fundingRate > 0 ? "text-green-500" : rate.fundingRate < 0 ? "text-red-500" : "text-muted-foreground";
              const rowBg =
                rate.anomalyLevel === "extreme"
                  ? "bg-red-500/5"
                  : rate.anomalyLevel === "elevated"
                  ? "bg-yellow-500/5"
                  : "";
              const isSelected = selectedSymbol === rate.symbol;

              return (
                <TableRow
                  key={rate.symbol}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${rowBg} ${isSelected ? "ring-1 ring-primary" : ""}`}
                  onClick={() => onSelectSymbol(rate.symbol)}
                >
                  <TableCell className="font-medium">
                    {rate.symbol.replace("USDT", "")}
                    <TierBadge tier={rate.symbolTier} />
                  </TableCell>
                  <TableCell className={`text-right font-mono ${rateColor}`}>
                    {formatFundingRate(rate.fundingRate)}
                  </TableCell>
                  <TableCell className={`text-right font-mono ${rateColor}`}>
                    {formatAnnualizedRate(rate.annualizedRate)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${formatPrice(rate.markPrice)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCountdown(rate.nextFundingTime)}
                  </TableCell>
                  <TableCell className="text-center">
                    <AnomalyBadge level={rate.anomalyLevel} />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
