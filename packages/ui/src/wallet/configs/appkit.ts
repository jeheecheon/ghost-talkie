import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { ENV } from "@workspace/ui/configs/env";
import { SUPPORTED_CHAINS } from "@workspace/domain/chains";

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [...SUPPORTED_CHAINS];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: ENV.REOWN_PROJECT_ID,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: ENV.REOWN_PROJECT_ID,
  metadata: {
    name: "GhostTalkie",
    description: "Serverless P2P Chat with Web3 Wallet Identity",
    url: "https://ghosttalkie.com",
    icons: ["https://ghosttalkie.com/icon.png"],
  },
});
