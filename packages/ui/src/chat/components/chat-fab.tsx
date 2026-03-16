import { MessageSquareMore } from "lucide-react";
import { Button } from "@workspace/ui/primitives/button";
import { cn } from "@workspace/lib/cn";
import { Portal, Transition } from "@headlessui/react";
import { useChatWidgetStore } from "@workspace/ui/chat/store/chat-widget";

type ChatFABProps = {
  className?: string;
  onClick: () => void;
};

export default function ChatFAB({ className, onClick }: ChatFABProps) {
  const isOpen = useChatWidgetStore((s) => s.isOpen);

  return (
    <Portal>
      <Transition
        className="fixed right-4 bottom-4 z-40 origin-bottom-right duration-100 ease-out data-closed:scale-50 data-closed:opacity-0"
        as="div"
        show={!isOpen}
      >
        <Button
          className={cn("rounded-full shadow-lg", className)}
          size="icon-lg"
          onClick={onClick}
        >
          <MessageSquareMore className="size-5" />
        </Button>
      </Transition>
    </Portal>
  );
}
