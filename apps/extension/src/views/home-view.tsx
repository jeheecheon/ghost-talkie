import LayoutContainer from "@workspace/ui/primitives/layout-container";
import SearchSection from "@workspace/ui/search/components/search-section";
import BookmarkSection from "@workspace/ui/search/components/bookmark-section";
import SearchHistorySection from "@workspace/ui/search/components/search-history-section";
import type { Address } from "viem";
import { cn } from "@workspace/lib/cn";

type HomeViewProps = {
  className?: string;
  onNavigateToProfile: (address: Address) => void;
};

export default function HomeView({
  className,
  onNavigateToProfile,
}: HomeViewProps) {
  return (
    <LayoutContainer className={cn("space-y-8", className)}>
      <SearchSection onSearch={onNavigateToProfile} />
      <hr />
      <BookmarkSection onProfileOpen={onNavigateToProfile} />
      <hr />
      <SearchHistorySection onProfileOpen={onNavigateToProfile} />
    </LayoutContainer>
  );
}
