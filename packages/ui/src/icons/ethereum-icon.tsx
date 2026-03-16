import { cn } from "@workspace/lib/cn";

type EthereumIconProps = {
  className?: string;
};

export default function EthereumIcon({ className }: EthereumIconProps) {
  return (
    <svg
      className={cn("", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
    >
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <path
        d="M16.498 4v8.87l7.497 3.35L16.498 4Z"
        fill="#fff"
        fillOpacity=".602"
      />
      <path d="M16.498 4 9 16.22l7.498-3.35V4Z" fill="#fff" />
      <path
        d="M16.498 21.968v6.027L24 17.616l-7.502 4.352Z"
        fill="#fff"
        fillOpacity=".602"
      />
      <path d="M16.498 27.995v-6.028L9 17.616l7.498 10.379Z" fill="#fff" />
      <path
        d="m16.498 20.573 7.497-4.353-7.497-3.348v7.701Z"
        fill="#fff"
        fillOpacity=".2"
      />
      <path
        d="m9 16.22 7.498 4.353v-7.701L9 16.22Z"
        fill="#fff"
        fillOpacity=".602"
      />
    </svg>
  );
}
