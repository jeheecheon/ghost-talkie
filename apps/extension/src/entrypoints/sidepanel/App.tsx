import RootProviders from "@/providers/root-providers";
import useWithWalletConnection from "@workspace/ui/wallet/hooks/use-with-wallet-connection";
import AppHeader from "@workspace/ui/navigation/components/app-header";
import FloatingNavigation from "@workspace/ui/navigation/components/floating-navigation";
import ChatWidget from "@workspace/ui/chat/components/chat-widget";
import { useNavigationStore } from "@/stores/navigation";
import { NAV_MENUS } from "@/configs/navigation";
import HomeView from "@/views/home-view";
import ChatView from "@/views/chat-view";
import ProfileView from "@/views/profile-view";
import { isAddress } from "viem";

export default function App() {
  return (
    <RootProviders>
      <AppContent />
    </RootProviders>
  );
}

function AppContent() {
  const { view, profileAddress, navigate, navigateToProfile } =
    useNavigationStore();
  const { address, withWalletConnection } = useWithWalletConnection();

  return (
    <div>
      <AppHeader
        className="fixed inset-x-0 top-0 z-20"
        onLogoClick={handleLogoClick}
        onNavigate={handleNavigate}
      />
      {view === "home" && <HomeView onNavigateToProfile={navigateToProfile} />}
      {view === "chat" && <ChatView onNavigateSearch={handleLogoClick} />}
      {view === "profile" && profileAddress && (
        <ProfileView address={profileAddress} />
      )}
      <FloatingNavigation
        tabs={NAV_MENUS.map((tab) => ({
          icon: tab.icon,
          label: tab.label,
          isActive: tab.isActive(view, address),
          onClick: () => handleTabClick(tab.label),
        }))}
      />
      <ChatWidget />
    </div>
  );

  function handleLogoClick() {
    navigate("home");
  }

  function handleNavigate(path: string) {
    const address = path.replace("/", "");

    if (isAddress(address)) {
      navigateToProfile(address);
    } else {
      navigate("home");
    }
  }

  function handleTabClick(label: string) {
    if (label === "Profile") {
      void withWalletConnection(async (addr) => {
        navigateToProfile(addr);
      });
      return;
    }

    const tab = NAV_MENUS.find((t) => t.label === label);

    if (tab) {
      navigate(tab.view);
    }
  }
}
