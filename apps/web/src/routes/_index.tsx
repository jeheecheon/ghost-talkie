import { useNavigate } from "react-router";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import SearchSection from "@workspace/ui/search/components/search-section";
import BookmarkSection from "@workspace/ui/search/components/bookmark-section";
import SearchHistorySection from "@workspace/ui/search/components/search-history-section";
import type { Address } from "viem";

export default function HomeRoute() {
  const navigate = useNavigate();

  return (
    <LayoutContainer className="space-y-8">
      <SearchSection onSearch={handleNavigateToProfile} />
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
