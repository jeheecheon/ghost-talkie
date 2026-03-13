import { useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@workspace/lib/cn";
import { ensure } from "@workspace/lib/assert";

function Textarea({
  className,
  ref: forwardedRef,
  value,
  defaultValue,
  ...props
}: React.ComponentProps<"textarea">) {
  const innerRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(forwardedRef, () => ensure(innerRef.current));

  useEffect(() => {
    if (!innerRef.current) {
      return;
    }

    innerRef.current.style.height = "auto";
    innerRef.current.style.height = `${innerRef.current.scrollHeight}px`;
  }, [value, defaultValue]);

  return (
    <textarea
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex w-full overflow-hidden rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={innerRef}
      data-slot="textarea"
      value={value}
      defaultValue={defaultValue}
      {...props}
    />
  );
}

export { Textarea };
