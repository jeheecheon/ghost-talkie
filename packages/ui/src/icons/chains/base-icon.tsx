import { cn } from "@workspace/lib/cn";

type BaseIconProps = {
  className?: string;
};

export default function BaseIcon({ className }: BaseIconProps) {
  return (
    <svg
      className={cn("", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
    >
      <circle cx="16" cy="16" r="16" fill="#0052FF" />
      <path
        d="M15.998 26c5.523 0 10-4.477 10-10s-4.477-10-10-10C10.832 6 6.584 9.947 6.06 15h11.938v2H6.06c.524 5.053 4.772 9 9.938 9Z"
        fill="#fff"
      />
    </svg>
  );
}
