import { cn } from "@workspace/lib/cn";
import { useId } from "react";

type CrossIconProps = {
  className?: string;
};

export default function CrossIcon({ className }: CrossIconProps) {
  const id = useId();

  return (
    <svg
      className={cn("", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      fill="none"
    >
      <circle cx="14" cy="14" r="14" fill={`url(#cross-grad-${id})`} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5 2L16.8817 4.38168V8.28089L19.9565 5.20611L23.3247 8.57431L20.2807 11.6183H14.5C13.1846 11.6183 12.1183 12.6846 12.1183 14C12.1183 15.3154 13.1846 16.3817 14.5 16.3817H20.2502L23.3248 19.4562L19.9566 22.8244L16.8817 19.7495V23.6183L14.5 26L12.1183 23.6183V19.7807L9.07458 22.8244L5.70637 19.4562L8.78089 16.3817H4.88168L2.5 14L4.88168 11.6183H8.75047L5.70646 8.57431L9.07467 5.20611L12.1183 8.24976V4.38168L14.5 2Z"
        fill="black"
      />
      <defs>
        <linearGradient
          id={`cross-grad-${id}`}
          x1="0.0276828"
          y1="14"
          x2="15.9002"
          y2="29.1275"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.2" stopColor="#20E2BB" />
          <stop offset="1" stopColor="#00AD8A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
