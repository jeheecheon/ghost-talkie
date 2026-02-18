import { A_DAY, A_MINUTE, A_SECOND, AN_HOUR } from "@/constants/misc";

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
