export function formatFundingRate(rate: number): string {
  return (rate * 100).toFixed(4) + "%";
}

export function formatAnnualizedRate(rate: number): string {
  return rate.toFixed(2) + "%";
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (price >= 1) {
    return price.toFixed(4);
  }
  if (price >= 0.01) {
    return price.toFixed(6);
  }
  return price.toFixed(8);
}

export function formatCountdown(targetMs: number): string {
  const diffMs = targetMs - Date.now();
  if (diffMs <= 0) {
    return "Now";
  }
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}
