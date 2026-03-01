"use client";

import { useFundingHistory } from "@/hooks/use-funding-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFundingRate, formatAnnualizedRate } from "@/lib/formatters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryChartProps {
  symbol: string;
  onClose: () => void;
}

export function HistoryChart({ symbol, onClose }: HistoryChartProps) {
  const { history, isLoading, error } = useFundingHistory(symbol);

  const chartData =
    history?.rates.map((r) => ({
      time: new Date(r.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
      }),
      rate: r.fundingRatePercent,
      annualized: r.annualizedRate,
    })) ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">
          {symbol.replace("USDT", "")} Funding Rate History
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            Failed to load history data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                stroke="#334155"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                stroke="#334155"
                tickFormatter={(v) => `${v.toFixed(3)}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#f1f5f9",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((value: any, name: any) => {
                  const v = Number(value) || 0;
                  if (name === "rate") return [`${v.toFixed(4)}%`, "Funding Rate"];
                  return [`${v.toFixed(2)}%`, "Annualized"];
                }) as any}
              />
              <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#6366f1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
