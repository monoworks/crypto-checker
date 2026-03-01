"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshIndicatorProps {
  secondsLeft: number;
  isValidating: boolean;
  onRefresh: () => void;
}

export function RefreshIndicator({
  secondsLeft,
  isValidating,
  onRefresh,
}: RefreshIndicatorProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      {isValidating && (
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          Updating...
        </span>
      )}
      <span>Next refresh: {secondsLeft}s</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onRefresh}
        disabled={isValidating}
      >
        <RefreshCw className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
