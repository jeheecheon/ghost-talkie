import { useCallback } from "react";
import { useStorageState } from "synced-storage/react";
import { isAddressEqual, type Address } from "viem";
import type { BookmarkEntry } from "@workspace/ui/search/types";

const STORAGE_KEY = "ghosttalkie:bookmarks";

type UseBookmarksReturn = {
  bookmarks: BookmarkEntry[];
  isBookmarked: (address: Address) => boolean;
  toggleBookmark: (address: Address, ensName?: string) => void;
  removeBookmark: (address: Address) => void;
};

export default function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useStorageState<BookmarkEntry[]>(
    STORAGE_KEY,
    [],
    { strategy: "localStorage" },
  );

  const isBookmarked = useCallback(
    (address: Address) =>
      bookmarks.some((entry) => isAddressEqual(entry.address, address)),
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    (address: Address, ensName?: string) => {
      setBookmarks((prev) => {
        const exists = prev.some((entry) =>
          isAddressEqual(entry.address, address),
        );

        if (exists) {
          return prev.filter(
            (entry) => !isAddressEqual(entry.address, address),
          );
        }

        return [...prev, { address, ensName, addedAt: Date.now() }];
      });
    },
    [setBookmarks],
  );

  const removeBookmark = useCallback(
    (address: Address) => {
      setBookmarks((prev) =>
        prev.filter((entry) => !isAddressEqual(entry.address, address)),
      );
    },
    [setBookmarks],
  );

  return { bookmarks, isBookmarked, toggleBookmark, removeBookmark };
}
