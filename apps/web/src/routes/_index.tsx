import { useNavigate } from "react-router";
import { ENV } from "@/configs/env";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import SearchSection from "@workspace/ui/search/components/search-section";
import BookmarkSection from "@workspace/ui/search/components/bookmark-section";
import SearchHistorySection from "@workspace/ui/search/components/search-history-section";
import type { Address } from "viem";

export function meta() {
  return [
    { title: "GhostTalkie" },
    {
      name: "description",
      content: "Search and explore blockchain wallet profiles on GhostTalkie.",
    },
    { property: "og:title", content: "GhostTalkie" },
    {
      property: "og:description",
      content: "Search and explore blockchain wallet profiles on GhostTalkie.",
    },
    { property: "og:type", content: "website" },
    {
      property: "og:image",
      content: `${ENV.BASE_PATH}ghost.svg`,
    },
    { property: "og:site_name", content: "GhostTalkie" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "GhostTalkie" },
    {
      name: "twitter:description",
      content: "Search and explore blockchain wallet profiles on GhostTalkie.",
    },
    {
      name: "twitter:image",
      content: `${ENV.BASE_PATH}ghost.svg`,
    },
  ];
}

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
