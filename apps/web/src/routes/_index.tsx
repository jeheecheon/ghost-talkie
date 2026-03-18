import { useNavigate } from "react-router";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import AddressSearchForm from "@workspace/ui/search/components/address-search-form";
import BookmarkSection from "@workspace/ui/search/components/bookmark-section";
import SearchHistorySection from "@workspace/ui/search/components/search-history-section";
import type { Address } from "viem";

export default function HomeRoute() {
  const navigate = useNavigate();

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
      <BookmarkSection onProfileOpen={handleNavigateToProfile} />
      <hr />
      <SearchHistorySection onProfileOpen={handleNavigateToProfile} />
    </LayoutContainer>
  );

  function handleNavigateToProfile(address: Address) {
    navigate(`/${address}`);
  }
}
