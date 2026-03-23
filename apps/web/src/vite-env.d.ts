/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOPIC_PREFIX?: string;
  readonly VITE_RELAYS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.md" {
  const html: string;
  export { html };
}
