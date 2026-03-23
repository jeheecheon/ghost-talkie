import { createContext, useContext, type PropsWithChildren } from "react";
import { createStore, type EIP6963ProviderInfo } from "mipd";
import { connect } from "wagmi/actions";
import { injected } from "wagmi/connectors";
import { sleep } from "@workspace/lib/misc";
import { wagmiConfig } from "@workspace/ui/wallet/configs/wagmi";

const PROVIDER_DISCOVERY_TIMEOUT_MS = 300;
const store = createStore();

export type InjectedWalletConfig = {
  discover: () => Promise<EIP6963ProviderInfo[]>;
  connect: (rdns: string) => Promise<void>;
};

const defaultConfig: InjectedWalletConfig = {
  discover: async () => {
    store.reset();
    await sleep(PROVIDER_DISCOVERY_TIMEOUT_MS);
    return store.getProviders().map((d) => d.info);
  },
  connect: async (rdns: string) => {
    const detail = store.findProvider({ rdns });

    if (!detail) {
      throw new Error("Provider not found");
    }

    await connect(wagmiConfig, {
      connector: injected({
        target: () => ({
          id: rdns,
          name: rdns,
          provider: detail.provider,
        }),
      }),
    });
  },
};

const InjectedWalletContext =
  createContext<InjectedWalletConfig>(defaultConfig);

export function useInjectedWallet() {
  return useContext(InjectedWalletContext);
}

type InjectedWalletProviderProps = PropsWithChildren<{
  config?: InjectedWalletConfig;
}>;

export default function InjectedWalletProvider({
  config = defaultConfig,
  children,
}: InjectedWalletProviderProps) {
  return (
    <InjectedWalletContext.Provider value={config}>
      {children}
    </InjectedWalletContext.Provider>
  );
}
