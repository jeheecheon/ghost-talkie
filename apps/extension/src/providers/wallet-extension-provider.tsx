import type { PropsWithChildren } from "react";
import { connect } from "wagmi/actions";
import { injected } from "wagmi/connectors";
import { WagmiProvider } from "wagmi";
import InjectedWalletProvider, {
  type InjectedWalletConfig,
} from "@workspace/ui/wallet/context/injected-wallet-provider";
import WalletSelectDialogProvider from "@workspace/ui/wallet/context/wallet-select-dialog-provider";
import { wagmiConfig } from "@workspace/ui/wallet/configs/wagmi";
import { WalletProviderProxy } from "@/lib/wallet-provider-proxy";
import { assert } from "@workspace/lib/assert";

const providerProxy = new WalletProviderProxy();

const extensionConfig: InjectedWalletConfig = {
  discover: () => providerProxy.discover(),
  connect: async (rdns: string) => {
    const selected = await providerProxy.select(rdns);
    assert(selected, "Failed to select wallet");

    await connect(wagmiConfig, {
      connector: injected({
        target: () => ({
          id: rdns,
          name: rdns,
          provider: providerProxy as any,
        }),
      }),
    });
  },
};

export default function ExtensionWalletProvider({
  children,
}: PropsWithChildren) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <InjectedWalletProvider config={extensionConfig}>
        <WalletSelectDialogProvider>{children}</WalletSelectDialogProvider>
      </InjectedWalletProvider>
    </WagmiProvider>
  );
}
