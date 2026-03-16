import { Link, Outlet } from "react-router";
import { Layout } from "@/layout";
import ErrorBoundary from "@/error-boundary";
import RootProviders from "@/providers/root-providers";
import ChatWidget from "@workspace/ui/chat/components/chat-widget";
import "@/globals.css";

export { Layout, ErrorBoundary };

export default function Root() {
  return (
    <RootProviders>
      <section>
        <Link to="/0xE7271a41640e91616674fcCB7F46Bd61d7815E30">Profile 1</Link>
        <Link to="/0xd76bc6C88DBf1923343BCCb2E8ed730d27597EfF">Profile 2</Link>
      </section>
      <Outlet />
      <ChatWidget />
    </RootProviders>
  );
}
