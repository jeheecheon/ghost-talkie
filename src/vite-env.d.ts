/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;
  readonly VITE_TOPIC_PREFIX?: string;
  readonly VITE_RELAYS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
