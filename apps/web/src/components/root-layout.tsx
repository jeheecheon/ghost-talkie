import { Outlet, useLocation, useNavigate } from "react-router";
import useWithWalletConnection from "@workspace/ui/wallet/hooks/use-with-wallet-connection";
import AppHeader from "@workspace/ui/navigation/components/app-header";
import FloatingNavigation from "@workspace/ui/navigation/components/floating-navigation";
import ChatWidget from "@workspace/ui/chat/components/chat-widget";
import { NAV_MENUS } from "@/configs/navigation";
import { cn } from "@workspace/lib/cn";

type RootLayoutProps = {
  className?: string;
};

export default function RootLayout({ className }: RootLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, withWalletConnection } = useWithWalletConnection();

  return (
    <div className={cn(className)}>
      <AppHeader
        className="fixed inset-x-0 top-0 z-20"
        onLogoClick={handleLogoClick}
        onNavigate={handleNavigate}
      />
      <Outlet />
      <FloatingNavigation
        tabs={NAV_MENUS.map((tab) => ({
          ...tab,
          isActive: tab.isActive(location.pathname, address),
          onClick: () => handleTabClick(tab.label),
        }))}
      />
      <ChatWidget />
    </div>
  );

  function handleLogoClick() {
    navigate("/");
  }

  function handleNavigate(path: string) {
    navigate(path);
  }

  function handleTabClick(label: string) {
    if (label === "Profile") {
      void withWalletConnection(async (addr) => {
        navigate(`/${addr}`);
      });

      return;
    }

    const tab = NAV_MENUS.find((t) => t.label === label);

    if (tab) {
      navigate(tab.pattern);
    }
  }
}
