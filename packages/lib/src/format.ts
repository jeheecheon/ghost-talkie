export function formatTokenBalance(value: number): string {
  if (value === 0) {
    return "0";
  }

  if (value < 0.0001) {
    return "< 0.0001";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(value);
}
