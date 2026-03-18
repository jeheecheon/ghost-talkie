import { cn } from "@workspace/lib/cn";
import BookmarkList from "@workspace/ui/search/components/bookmark-list";
import useBookmarks from "@workspace/ui/search/hooks/use-bookmarks";
import type { Address } from "viem";

type BookmarkSectionProps = {
  className?: string;
  onProfileOpen: (address: Address, ensName?: string) => void;
};

export default function BookmarkSection({
  className,
  onProfileOpen,
}: BookmarkSectionProps) {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <section className={cn("space-y-3", className)}>
      <h2 className="text-sm font-semibold">Bookmarks</h2>

      <BookmarkList
        bookmarks={bookmarks}
        onSelect={onProfileOpen}
        onRemove={removeBookmark}
      />
    </section>
  );
}
