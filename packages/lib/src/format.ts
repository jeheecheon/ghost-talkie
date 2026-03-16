export function formatTokenBalance(value: number): string {
  if (value === 0) {
    return "0";
  }

  if (value < 0.0001) {
    return "< 0.0001";
  }

  return value.toFixed(4);
}
