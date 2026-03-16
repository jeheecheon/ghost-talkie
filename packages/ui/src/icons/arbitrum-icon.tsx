import { cn } from "@workspace/lib/cn";

type ArbitrumIconProps = {
  className?: string;
};

export default function ArbitrumIcon({ className }: ArbitrumIconProps) {
  return (
    <svg
      className={cn("", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
    >
      <circle cx="16" cy="16" r="16" fill="#2D374B" />
      <path
        d="m16.62 8.2 6.16 9.74c.24.38.24.86 0 1.24l-2.1 3.32-4.06-6.5 4.06-6.56a.71.71 0 0 0-.06-1.24Z"
        fill="#28A0F0"
      />
      <path
        d="m20.68 22.5-4.06-6.5-4.06 6.5h-2.42L16 12.22a.71.71 0 0 1 1.24 0l5.86 10.28h-2.42Z"
        fill="#fff"
      />
      <path
        d="M9.22 17.94 16 6.96a.71.71 0 0 1 .62-.36.71.71 0 0 0-.62.36l-4.06 6.56-2.72 4.42Z"
        fill="#28A0F0"
      />
    </svg>
  );
}
