"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FundingRateData } from "@/types/funding-rate";
import { computeStats } from "@/lib/funding-rate-analyzer";
import { formatFundingRate, formatAnnualizedRate } from "@/lib/formatters";

interface StatsCardsProps {
  rates: FundingRateData[];
}

export function StatsCards({ rates }: StatsCardsProps) {
  const stats = computeStats(rates);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Bullish</CardTitle>
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Long Squeeze Risk
          </Badge>
        </CardHeader>
        <CardContent>
          {stats.mostPositive ? (
            <>
              <div className="text-2xl font-bold text-green-500">
                {stats.mostPositive.symbol.replace("USDT", "")}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatFundingRate(stats.mostPositive.fundingRate)} ({formatAnnualizedRate(stats.mostPositive.annualizedRate)} APY)
              </p>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Bearish</CardTitle>
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Short Squeeze Risk
          </Badge>
        </CardHeader>
        <CardContent>
          {stats.mostNegative ? (
            <>
              <div className="text-2xl font-bold text-red-500">
                {stats.mostNegative.symbol.replace("USDT", "")}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatFundingRate(stats.mostNegative.fundingRate)} ({formatAnnualizedRate(stats.mostNegative.annualizedRate)} APY)
              </p>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Extreme Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.extremeCount > 0 ? (
              <span className="text-red-500">{stats.extremeCount}</span>
            ) : (
              <span className="text-muted-foreground">0</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            symbols with extreme funding rates
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Elevated Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.elevatedCount > 0 ? (
              <span className="text-yellow-500">{stats.elevatedCount}</span>
            ) : (
              <span className="text-muted-foreground">0</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            symbols with elevated funding rates
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
