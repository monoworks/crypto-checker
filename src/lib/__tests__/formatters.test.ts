import { describe, it, expect, vi } from "vitest";
import {
  formatFundingRate,
  formatAnnualizedRate,
  formatPrice,
  formatCountdown,
} from "../formatters";

describe("formatFundingRate", () => {
  it("formats positive funding rate", () => {
    expect(formatFundingRate(0.0001)).toBe("0.0100%");
  });

  it("formats negative funding rate", () => {
    expect(formatFundingRate(-0.0005)).toBe("-0.0500%");
  });

  it("formats zero funding rate", () => {
    expect(formatFundingRate(0)).toBe("0.0000%");
  });

  it("formats extreme negative rate (BERA-like)", () => {
    expect(formatFundingRate(-0.05)).toBe("-5.0000%");
  });
});

describe("formatAnnualizedRate", () => {
  it("formats positive annualized rate", () => {
    expect(formatAnnualizedRate(10.95)).toBe("10.95%");
  });

  it("formats negative annualized rate", () => {
    expect(formatAnnualizedRate(-54.75)).toBe("-54.75%");
  });

  it("formats zero", () => {
    expect(formatAnnualizedRate(0)).toBe("0.00%");
  });

  it("formats extreme values", () => {
    expect(formatAnnualizedRate(-5475)).toBe("-5475.00%");
  });
});

describe("formatPrice", () => {
  it("formats high price with 2 decimals", () => {
    expect(formatPrice(87000.5)).toBe("87,000.50");
  });

  it("formats mid-range price with 4 decimals", () => {
    expect(formatPrice(1.2345)).toBe("1.2345");
  });

  it("formats small price with 6 decimals", () => {
    expect(formatPrice(0.05)).toBe("0.050000");
  });

  it("formats very small price with 8 decimals", () => {
    expect(formatPrice(0.00012)).toBe("0.00012000");
  });
});

describe("formatCountdown", () => {
  it("formats future time as hours and minutes", () => {
    const now = Date.now();
    const twoHoursThirtyMin = now + 2 * 3600000 + 30 * 60000;
    vi.setSystemTime(now);
    expect(formatCountdown(twoHoursThirtyMin)).toBe("2h 30m");
    vi.useRealTimers();
  });

  it("returns 'Now' for past time", () => {
    expect(formatCountdown(Date.now() - 1000)).toBe("Now");
  });

  it("formats zero hours correctly", () => {
    const now = Date.now();
    const fifteenMin = now + 15 * 60000;
    vi.setSystemTime(now);
    expect(formatCountdown(fifteenMin)).toBe("0h 15m");
    vi.useRealTimers();
  });
});
