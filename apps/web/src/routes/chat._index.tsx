import { useNavigate } from "react-router";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import ChatRoomSection from "@workspace/ui/chat/components/chat-room-section";

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
