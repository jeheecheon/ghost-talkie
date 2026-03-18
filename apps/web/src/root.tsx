import { Outlet, useNavigate } from "react-router";
import { Layout } from "@/layout";
import ErrorBoundary from "@/error-boundary";
import RootProviders from "@/providers/root-providers";
import AppHeader from "@workspace/ui/header/components/app-header";
import ChatWidget from "@workspace/ui/chat/components/chat-widget";
import "@/globals.css";

export { Layout, ErrorBoundary };

export default function Root() {
  const navigate = useNavigate();

  return (
    <RootProviders>
      <AppHeader
        className="fixed inset-x-0 top-0 z-50"
        onLogoClick={handleLogoClick}
        onNavigate={handleNavigate}
      />
      <Outlet />
      <ChatWidget />
    </RootProviders>
  );

  function handleLogoClick() {
    navigate("/");
  }

  function handleNavigate(path: string) {
    navigate(path);
  }
}
