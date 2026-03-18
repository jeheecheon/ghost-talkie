import { useState, type SubmitEvent } from "react";
import { Search, ClipboardPaste, X, Loader2 } from "lucide-react";
import { cn } from "@workspace/lib/cn";
import { shortenAddress } from "@workspace/lib/address";
import { Input } from "@workspace/ui/primitives/input";
import { Button } from "@workspace/ui/primitives/button";
import useEnsLookup from "@workspace/ui/search/hooks/use-ens-lookup";
import { toast } from "sonner";
import type { Address } from "viem";
import type { Optional } from "@workspace/types/misc";

type AddressSearchFormProps = {
  className?: string;
  onSearch: (address: Address, ensName?: string) => void;
};

export default function AddressSearchForm({
  className,
  onSearch,
}: AddressSearchFormProps) {
  const [query, setQuery] = useState("");

  const hasInput = query.length > 0;
  const { ensAddress, ensName, isLoading, status } = useEnsLookup({
    query,
    enabled: hasInput,
  });

  return (
    <form className={cn("space-y-2", className)} onSubmit={handleSubmit}>
      <div className="flex gap-x-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="pr-10 pl-9"
            placeholder="Enter wallet address or ENS name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            className="absolute top-1/2 right-1 -translate-y-1/2"
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={hasInput ? () => setQuery("") : handlePaste}
          >
            {hasInput ? (
              <X className="size-3.5" />
            ) : (
              <ClipboardPaste className="size-3.5" />
            )}
          </Button>
        </div>

        <Button type="submit" disabled={!ensAddress || isLoading}>
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      <EnsStatusMessage
        status={status}
        query={query}
        ensAddress={ensAddress}
        ensName={ensName}
      />
    </form>
  );

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ensAddress) {
      return;
    }

    onSearch(ensAddress, ensName);
    setQuery("");
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setQuery(text.trim());
    } catch {
      toast.error("Failed to read clipboard");
    }
  }
}

type EnsStatusMessageProps = {
  className?: string;
  status: string;
  query: string;
  ensAddress: Optional<Address>;
  ensName: Optional<string>;
};

function EnsStatusMessage({
  className,
  status,
  query,
  ensAddress,
  ensName,
}: EnsStatusMessageProps) {
  return (
    <div className={cn(className)}>
      {status === "invalid-format" && (
        <p className="text-destructive text-sm">
          Enter a valid address or ENS name
        </p>
      )}

      {status === "name-resolving" && (
        <p className="text-muted-foreground text-sm">
          {`Resolving ${query}...`}
        </p>
      )}

      {status === "name-resolved" && ensAddress && (
        <p className="text-foreground text-sm">
          {`${query} → ${shortenAddress(ensAddress)}`}
        </p>
      )}

      {status === "name-not-found" && (
        <p className="text-destructive text-sm">
          {`No address found for ${query}`}
        </p>
      )}

      {status === "address-resolving" && ensAddress && (
        <p className="text-muted-foreground text-sm">
          {`Resolving ${shortenAddress(ensAddress)}...`}
        </p>
      )}

      {status === "address-resolved" && ensAddress && (
        <p className="text-foreground text-sm">
          {`${shortenAddress(ensAddress)} → ${ensName}`}
        </p>
      )}

      {status === "address-not-found" && ensAddress && (
        <div className="flex items-center gap-x-2 text-sm">
          <span className="text-foreground">{shortenAddress(ensAddress)}</span>
          <span className="text-muted-foreground">· ENS not registered</span>
        </div>
      )}
    </div>
  );
}
