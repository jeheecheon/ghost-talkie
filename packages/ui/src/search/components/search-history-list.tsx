import { Trash2, Star, StarOff, X } from "lucide-react";
import { cn } from "@workspace/lib/cn";
import { formatRelativeTime } from "@workspace/lib/time";
import { shortenAddress } from "@workspace/lib/address";
import { Button } from "@workspace/ui/primitives/button";
import AddressAvatar from "@workspace/ui/wallet/components/address-avatar";
import type { SearchHistoryEntry } from "@workspace/ui/search/types";
import type { Address } from "viem";

type SearchHistoryListProps = {
  className?: string;
  history: SearchHistoryEntry[];
  isBookmarked: (address: Address) => boolean;
  onSelect: (address: Address, ensName?: string) => void;
  onRemove: (address: Address) => void;
  onToggleBookmark: (address: Address, ensName?: string) => void;
  onClearAll: () => void;
};

export default function SearchHistoryList({
  className,
  history,
  isBookmarked,
  onSelect,
  onRemove,
  onToggleBookmark,
  onClearAll,
}: SearchHistoryListProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recent Searches</h2>

        {history.length > 0 && (
          <Button variant="ghost" size="xs" onClick={onClearAll}>
            <Trash2 className="size-3" />
            Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Your recent lookups will appear here
        </p>
      ) : (
        <ul className="space-y-1">
          {history.map((entry) => (
            <SearchHistoryItem
              key={entry.address}
              entry={entry}
              bookmarked={isBookmarked(entry.address)}
              onSelect={onSelect}
              onRemove={onRemove}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

type SearchHistoryItemProps = {
  entry: SearchHistoryEntry;
  bookmarked: boolean;
  onSelect: (address: Address, ensName?: string) => void;
  onRemove: (address: Address) => void;
  onToggleBookmark: (address: Address, ensName?: string) => void;
};

function SearchHistoryItem({
  entry,
  bookmarked,
  onSelect,
  onRemove,
  onToggleBookmark,
}: SearchHistoryItemProps) {
  return (
    <li
      className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      <AddressAvatar className="size-8 shrink-0" address={entry.address} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-sm">
          {shortenAddress(entry.address)}
        </p>

        {entry.ensName && (
          <p className="text-muted-foreground truncate text-xs">
            {entry.ensName}
          </p>
        )}
      </div>

      <p className="text-muted-foreground shrink-0 text-xs">
        {formatRelativeTime(entry.timestamp / 1000)}
      </p>

      <Button
        className="shrink-0"
        variant="ghost"
        size="icon-xs"
        onClick={handleToggleBookmark}
      >
        {bookmarked ? (
          <Star className="size-3.5 fill-current" />
        ) : (
          <StarOff className="size-3.5" />
        )}
      </Button>

      <Button
        className="shrink-0"
        variant="ghost"
        size="icon-xs"
        onClick={handleRemove}
      >
        <X className="size-3.5" />
      </Button>
    </li>
  );

  function handleSelect() {
    onSelect(entry.address, entry.ensName);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      onSelect(entry.address, entry.ensName);
    }
  }

  function handleToggleBookmark(e: React.MouseEvent) {
    e.stopPropagation();
    onToggleBookmark(entry.address, entry.ensName);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    onRemove(entry.address);
  }
}
