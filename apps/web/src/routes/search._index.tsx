import { useNavigate } from "react-router";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import AddressSearchForm from "@workspace/ui/search/components/address-search-form";
import SearchHistoryList from "@workspace/ui/search/components/search-history-list";
import BookmarkList from "@workspace/ui/search/components/bookmark-list";
import useSearchHistory from "@workspace/ui/search/hooks/use-search-history";
import useBookmarks from "@workspace/ui/search/hooks/use-bookmarks";
import type { Address } from "viem";

export default function SearchRoute() {
  const navigate = useNavigate();
  const { history, addEntry, removeEntry, clearAll } = useSearchHistory();
  const { bookmarks, removeBookmark, isBookmarked, toggleBookmark } =
    useBookmarks();

  return (
    <LayoutContainer className="space-y-8 pt-20 pb-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Search Wallets</h1>
        <p className="text-muted-foreground text-sm">
          Look up any wallet by address or ENS name
        </p>
      </div>
      <AddressSearchForm onSearch={handleNavigateToProfile} />
      <hr />
      <BookmarkList
        bookmarks={bookmarks}
        onSelect={handleNavigateToProfile}
        onRemove={removeBookmark}
      />
      <hr />
      <SearchHistoryList
        history={history}
        isBookmarked={isBookmarked}
        onSelect={handleNavigateToProfile}
        onRemove={removeEntry}
        onToggleBookmark={toggleBookmark}
        onClearAll={clearAll}
      />
    </LayoutContainer>
  );

  function handleNavigateToProfile(address: Address, ensName?: string) {
    addEntry(address, ensName);
    navigate(`/${address}`);
  }
}
