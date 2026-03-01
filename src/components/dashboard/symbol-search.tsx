"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnomalyLevel } from "@/types/funding-rate";
import { Search } from "lucide-react";

interface SymbolSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterLevel: AnomalyLevel | "all";
  onFilterChange: (level: AnomalyLevel | "all") => void;
}

export function SymbolSearch({
  searchQuery,
  onSearchChange,
  filterLevel,
  onFilterChange,
}: SymbolSearchProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search symbol (e.g. BTC, ETH, SOL)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={filterLevel}
        onValueChange={(value) => onFilterChange(value as AnomalyLevel | "all")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="extreme">Extreme Only</SelectItem>
          <SelectItem value="elevated">Elevated Only</SelectItem>
          <SelectItem value="normal">Normal Only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
