import { useCallback } from "react";
import { useStorageState } from "synced-storage/react";
import { isAddressEqual, type Address } from "viem";
import type { SearchHistoryEntry } from "@workspace/ui/search/types";

const STORAGE_KEY = "ghosttalkie:search-history";
const MAX_HISTORY_SIZE = 20;

type UseSearchHistoryReturn = {
  history: SearchHistoryEntry[];
  addEntry: (address: Address, ensName?: string) => void;
  removeEntry: (address: Address) => void;
  clearAll: () => void;
};

export default function useSearchHistory(): UseSearchHistoryReturn {
  const [history, setHistory] = useStorageState<SearchHistoryEntry[]>(
    STORAGE_KEY,
    [],
    { strategy: "localStorage" },
  );

  const addEntry = useCallback(
    (address: Address, ensName?: string) => {
      setHistory((prev) => {
        const filtered = prev.filter(
          (entry) => !isAddressEqual(entry.address, address),
        );

        return [{ address, ensName, timestamp: Date.now() }, ...filtered].slice(
          0,
          MAX_HISTORY_SIZE,
        );
      });
    },
    [setHistory],
  );

  const removeEntry = useCallback(
    (address: Address) => {
      setHistory((prev) =>
        prev.filter((entry) => !isAddressEqual(entry.address, address)),
      );
    },
    [setHistory],
  );

  const clearAll = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return { history, addEntry, removeEntry, clearAll };
}
