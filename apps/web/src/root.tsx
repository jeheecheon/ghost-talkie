import { Outlet } from "react-router";
import { Layout } from "@/layout";
import ErrorBoundary from "@/error-boundary";
import RootProviders from "@/providers/root-providers";
import ChatWidget from "@workspace/ui/chat/components/chat-widget";
import "@/globals.css";

export { Layout, ErrorBoundary };

export default function Root() {
  return (
    <RootProviders>
      <Outlet />
      <ChatWidget />
    </RootProviders>
  );
}
