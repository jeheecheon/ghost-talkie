export const A_SECOND = 1_000;
export const A_MINUTE = 60 * A_SECOND;
export const AN_HOUR = 60 * A_MINUTE;
export const A_DAY = 24 * AN_HOUR;

export function formatRelativeTime(unixSeconds: number): string {
  const diffMs = Date.now() - unixSeconds * A_SECOND;

  if (diffMs < A_MINUTE) {
    return "just now";
  }
  if (diffMs < AN_HOUR) {
    return `${Math.floor(diffMs / A_MINUTE)}m ago`;
  }
  if (diffMs < A_DAY) {
    return `${Math.floor(diffMs / AN_HOUR)}h ago`;
  }

  return `${Math.floor(diffMs / A_DAY)}d ago`;
}
