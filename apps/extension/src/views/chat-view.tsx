import LayoutContainer from "@workspace/ui/primitives/layout-container";
import ChatRoomSection from "@workspace/ui/chat/components/chat-room-section";

type ChatViewProps = {
  className?: string;
  onNavigateSearch: () => void;
};

export default function ChatView({
  className,
  onNavigateSearch,
}: ChatViewProps) {
  return (
    <LayoutContainer className={className}>
      <ChatRoomSection onSearch={onNavigateSearch} />
    </LayoutContainer>
  );
}
