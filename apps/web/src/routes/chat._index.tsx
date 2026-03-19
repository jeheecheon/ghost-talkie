import { useNavigate } from "react-router";
import { ENV } from "@/configs/env";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import ChatRoomSection from "@workspace/ui/chat/components/chat-room-section";

export function meta() {
  return [
    { title: "Chat | GhostTalkie" },
    { name: "description", content: "Chat with other users on GhostTalkie." },
    { property: "og:title", content: "Chat | GhostTalkie" },
    {
      property: "og:description",
      content: "Chat with other users on GhostTalkie.",
    },
    { property: "og:type", content: "website" },
    { property: "og:image", content: `${ENV.BASE_PATH}ghost.svg` },
    { property: "og:site_name", content: "GhostTalkie" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Chat | GhostTalkie" },
    {
      name: "twitter:description",
      content: "Chat with other users on GhostTalkie.",
    },
    { name: "twitter:image", content: `${ENV.BASE_PATH}ghost.svg` },
  ];
}

export default function ChatRoute() {
  const navigate = useNavigate();

  return (
    <LayoutContainer>
      <ChatRoomSection onSearch={handleNavigateSearch} />
    </LayoutContainer>
  );

  function handleNavigateSearch() {
    navigate("/");
  }
}
