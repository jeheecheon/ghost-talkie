import { useChatWidgetStore } from "@workspace/ui/chat/store/chat-widget";
import ChatRoomView from "@workspace/ui/chat/components/chat-room-view";
import ChatFAB from "@workspace/ui/chat/components/chat-fab";
import ResponsiveConfirmDialog from "@workspace/ui/primitives/responsive-confirm-dialog";
import { shortenAddress } from "@workspace/lib/address";
import { cn } from "@workspace/lib/cn";

type ChatWidgetProps = {
  className?: string;
};

export default function ChatWidget({ className }: ChatWidgetProps) {
  const {
    roomAddress,
    chatProof,
    pendingRoomAddress,
    expand,
    confirmRoomSwitch,
    cancelRoomSwitch,
  } = useChatWidgetStore((state) => state);

  const hasActiveRoom = roomAddress && chatProof;

  return (
    <div className={cn("", className)}>
      {hasActiveRoom && (
        <>
          <ChatRoomView roomAddress={roomAddress} chatProof={chatProof} />
          <ChatFAB onClick={expand} />

          {pendingRoomAddress && (
            <ResponsiveConfirmDialog
              isOpen={!!pendingRoomAddress}
              title="Switch Chat?"
              description={
                <>
                  You have an active chat with{" "}
                  <span className="text-foreground font-medium">
                    {shortenAddress(roomAddress)}
                  </span>
                  . Start a new chat with{" "}
                  <span className="text-foreground font-medium">
                    {shortenAddress(pendingRoomAddress)}
                  </span>
                  ?
                </>
              }
              confirmLabel="Switch"
              onConfirm={confirmRoomSwitch}
              onClose={cancelRoomSwitch}
            />
          )}
        </>
      )}
    </div>
  );
}
