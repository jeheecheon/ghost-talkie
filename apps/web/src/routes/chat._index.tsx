import { useNavigate } from "react-router";
import LayoutContainer from "@workspace/ui/primitives/layout-container";
import ChatRoomSection from "@workspace/ui/chat/components/chat-room-section";

export default function ChatRoute() {
  const navigate = useNavigate();

  return (
    <LayoutContainer className="pt-20 pb-10">
      <ChatRoomSection onSearch={handleNavigateSearch} />
    </LayoutContainer>
  );

  function handleNavigateSearch() {
    navigate("/");
  }
}
