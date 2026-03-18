import { X } from "lucide-react";
import { cn } from "@workspace/lib/cn";
import { shortenAddress } from "@workspace/lib/address";
import { Button } from "@workspace/ui/primitives/button";
import AddressAvatar from "@workspace/ui/wallet/components/address-avatar";
import type { BookmarkEntry } from "@workspace/ui/search/types";
import type { Address } from "viem";

type BookmarkListProps = {
  className?: string;
  bookmarks: BookmarkEntry[];
  onSelect: (address: Address, ensName?: string) => void;
  onRemove: (address: Address) => void;
};

export default function BookmarkList({
  className,
  bookmarks,
  onSelect,
  onRemove,
}: BookmarkListProps) {
  return (
    <div className={cn(className)}>
      {bookmarks.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Star a search to save it here
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {bookmarks.map((entry) => (
            <BookmarkItem
              key={entry.address}
              entry={entry}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

type BookmarkItemProps = {
  entry: BookmarkEntry;
  onSelect: (address: Address, ensName?: string) => void;
  onRemove: (address: Address) => void;
};

function BookmarkItem({ entry, onSelect, onRemove }: BookmarkItemProps) {
  return (
    <li
      className="border-border hover:bg-accent flex cursor-pointer items-center gap-2 rounded-full border py-1.5 pr-2 pl-3 transition-colors"
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      <AddressAvatar className="size-5" address={entry.address} />

      <span className="text-sm">
        {entry.ensName ?? shortenAddress(entry.address)}
      </span>

      <Button variant="ghost" size="icon-xs" onClick={handleRemove}>
        <X className="size-3" />
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

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    onRemove(entry.address);
  }
}
