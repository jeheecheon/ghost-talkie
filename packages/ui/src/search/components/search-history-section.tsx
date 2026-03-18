import { cn } from "@workspace/lib/cn";
import SearchHistoryList from "@workspace/ui/search/components/search-history-list";
import useSearchHistory from "@workspace/ui/search/hooks/use-search-history";
import useBookmarks from "@workspace/ui/search/hooks/use-bookmarks";
import type { Address } from "viem";

type SearchHistorySectionProps = {
  className?: string;
  onProfileOpen: (address: Address, ensName?: string) => void;
};

export default function SearchHistorySection({
  className,
  onProfileOpen,
}: SearchHistorySectionProps) {
  const { history, addEntry, removeEntry, clearAll } = useSearchHistory();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  return (
    <section className={cn("space-y-3", className)}>
      <h2 className="text-sm font-semibold">Recent Searches</h2>

      <SearchHistoryList
        history={history}
        isBookmarked={isBookmarked}
        onSelect={handleSelect}
        onRemove={removeEntry}
        onToggleBookmark={toggleBookmark}
        onClearAll={clearAll}
      />
    </section>
  );

  function handleSelect(address: Address, ensName?: string) {
    addEntry(address, ensName);
    onProfileOpen(address, ensName);
  }
}
