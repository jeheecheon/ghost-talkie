# Monorepo Architecture

**Last Updated:** March 12, 2026
**Architecture:** Package-Oriented Monorepo with Feature-Based Internal Structure
**Pattern Family:** Vertical Slice Architecture (adapted for React monorepo)

---

## Overview

GhostTalkie uses a **package-oriented monorepo** where shared code lives in independently versioned packages, and each app is a thin shell that composes them. The goal is simple: **web and extension share one codebase with zero duplication.**

### Core Principles

1. **Package Boundaries:** Separate packages by technical role (UI, domain, lib). Each has its own `package.json` and dependency scope.
2. **Feature Co-location:** Within a package, organize by business feature (chat, comment, wallet), not by technical type.
3. **Thin Apps:** Apps contain only routing, layouts, and app-specific glue. All reusable code lives in `packages/`.
4. **Composition over Duplication:** When an app needs a variant of a shared component, wrap it — never copy it.
5. **Extract on First Reuse:** Move code to `packages/` the moment a second app needs it. Not before, not after.

---

## Directory Structure

```
ghosttalkie/
├── apps/
│   ├── web/                        # React Router v7 SPA
│   │   └── src/
│   │       ├── routes/             # File-based routes
│   │       ├── configs/            # App configuration (wagmi, env)
│   │       └── utils/              # App-specific utilities
│   └── extension/                  # WXT browser extension
│       └── src/
│           ├── entrypoints/        # Popup, side panel, content script
│           └── components/         # Extension-only components
│
├── packages/
│   ├── tsconfig/                   # Shared TypeScript configurations
│   ├── eslint-config/              # Shared ESLint presets
│   ├── types/                      # Nullable<T>, Maybe<T>, shared type definitions
│   ├── lib/                        # Pure utilities (no React dependency)
│   ├── domain/                     # Business logic (no React dependency)
│   │   └── src/
│   │       ├── p2p/               # Trystero connection, messaging
│   │       ├── nostr/             # Nostr client, comment protocol
│   │       └── wallet/            # wagmi config, signature utils
│   └── ui/                         # React components + hooks
│       └── src/
│           ├── primitives/        # Button, Input, Dialog (Radix-based atoms)
│           ├── chat/              # ChatBubble, ChatRoom, useChat
│           ├── comment/           # CommentForm, CommentList, useComments
│           ├── wallet/            # WalletProfileCard, useWallet
│           └── hooks/             # useToast, useMediaQuery (feature-agnostic)
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Dependency Direction

Imports flow **top to bottom only.** A lower layer never imports from a higher layer.

```
Level 0    tsconfig, eslint-config
                    │
Level 1           types
                    │
Level 2            lib                  ← Pure functions, no React
                    │
Level 3          domain                 ← Business logic, no React
                    │
Level 4            ui                   ← React components + hooks
                    │
Level 5     apps/web, apps/extension    ← Routing, layouts, app glue
```

**Why this order matters:**

- `domain` has no React dependency. It can run in Node, a worker thread, or any future runtime without modification.
- `ui` imports from `domain` to connect business logic to React state. This is the primary layer where React hooks wrap domain classes.
- `apps/` import from `ui` and compose pages. For domain classes that need React lifecycle management (subscriptions, cleanup), apps import through `ui` hooks. For stateless utilities and configuration (e.g., `EIP6963Discovery`, chain definitions), apps may import from `domain` directly.

---

## Where Does Code Go?

### Decision Tree

```
Is it a React component?
├─ Used by ONE app only?
│  └─ apps/[app]/src/components/
├─ Used by BOTH apps?
│  └─ Is it a primitive (Button, Input, Dialog)?
│     ├─ Yes → packages/ui/src/primitives/
│     └─ No  → packages/ui/src/[feature]/components/
└─ Not a React component? → See below.

Is it a React hook?
├─ Wraps domain logic (P2P, Nostr, Wallet)?
│  └─ packages/ui/src/[feature]/hooks/
├─ UI utility (toast, media query)?
│  └─ packages/ui/src/hooks/
└─ App-specific (route params, layout state)?
   └─ apps/[app]/src/hooks/

Is it business logic (no React)?
├─ P2P connection/messaging?
│  └─ packages/domain/src/p2p/
├─ Nostr protocol?
│  └─ packages/domain/src/nostr/
└─ Wallet signatures/verification?
   └─ packages/domain/src/wallet/

Is it a pure utility function?
├─ React-independent (cn, assert, crypto)?
│  └─ packages/lib/src/
└─ React-dependent?
   └─ packages/ui/src/hooks/ or [feature]/hooks/

Is it a type definition?
├─ Shared across packages (Nullable, Maybe)?
│  └─ packages/types/src/
├─ Feature-specific?
│  └─ Co-locate in the feature directory
└─ App-specific?
   └─ apps/[app]/src/types/
```

---

## Package Details

### packages/tsconfig

Shared TypeScript configurations. Apps and packages extend from these.

```
tsconfig/
├── base.json              # Strict defaults (all packages extend this)
└── react.json             # Extends base, adds JSX support
```

### packages/eslint-config

Shared ESLint flat config presets.

```
eslint-config/
├── base.js                # TypeScript + Prettier (all packages)
└── react.js               # React hooks + JSX rules
```

### packages/types

Shared type definitions used across multiple packages.

```typescript
// packages/types/src/misc.ts
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined
```

### packages/lib

Pure utility functions. **No React dependency.** No side effects.

```typescript
// packages/lib/src/assert.ts
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) throw new Error(message ?? "Assertion failed")
}

export function ensure<T>(value: Maybe<T>, message?: string): T {
  assert(value != null, message ?? "Expected non-nullable value")
  return value
}
```

```typescript
// packages/lib/src/cn.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### packages/domain

Business logic. **No React dependency.** Classes and pure functions only.

Each feature directory contains its own types, constants, and logic:

```
domain/src/
├── p2p/
│   ├── chat-client.ts         # Trystero room management
│   ├── chat-client.type.ts    # Message, Peer, RoomConfig types
│   └── chat-proof.ts          # Chat proof sign/verify
├── nostr/
│   ├── nostr-client.ts        # Relay connection, event publish/query
│   ├── nostr-client.type.ts   # NostrEvent, Comment types
│   └── nostr-identity.ts      # Key derivation from wallet signature
└── wallet/
    ├── wagmi-config.ts        # Chain config, connectors
    ├── wallet.type.ts         # WalletProfile, TrustSignal types
    └── signature.ts           # Sign/verify message utils
```

**Example — domain class with no React:**

```typescript
// packages/domain/src/p2p/chat-client.ts
export class ChatClient {
  private room: Room | null = null

  connect(roomId: string, config: RoomConfig): void {
    this.room = joinRoom({ appId: config.appId }, roomId)
  }

  onMessage(callback: (message: Message) => void): void {
    this.room?.onPeerMessage(callback)
  }

  send(message: string): void {
    this.room?.sendMessage(message)
  }

  disconnect(): void {
    this.room?.leave()
    this.room = null
  }
}
```

### packages/ui

React components and hooks. This is the **only package with a React dependency** among shared packages.

**Internal structure — feature-based:**

```
ui/src/
├── primitives/                # Atoms (feature-agnostic)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── scroll-area.tsx
├── chat/                      # Chat feature
│   ├── components/
│   │   ├── chat-bubble.tsx
│   │   └── chat-room.tsx
│   └── hooks/
│       └── use-chat.ts
├── comment/                   # Comment feature
│   ├── components/
│   │   ├── comment-form.tsx
│   │   ├── comment-list.tsx
│   │   └── comment-section.tsx
│   └── hooks/
│       └── use-comments.ts
├── wallet/                    # Wallet feature
│   ├── components/
│   │   └── wallet-profile-card.tsx
│   └── hooks/
│       └── use-wallet.ts
└── hooks/                     # Feature-agnostic hooks
    ├── use-toast.ts
    └── use-media-query.ts
```

**Example — hook wrapping a domain class:**

```typescript
// packages/ui/src/chat/hooks/use-chat.ts
import { ChatClient } from "@workspace/domain/p2p/chat-client"
import type { Message } from "@workspace/domain/p2p/chat-client.type"

export function useChat(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const clientRef = useRef<ChatClient | null>(null)

  useEffect(() => {
    const client = new ChatClient()
    clientRef.current = client

    client.connect(roomId, { appId: "ghosttalkie" })
    client.onMessage((message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => client.disconnect()
  }, [roomId])

  const send = useCallback((text: string) => {
    clientRef.current?.send(text)
  }, [])

  return { messages, send }
}
```

**Package exports (granular, for tree-shaking):**

```json
{
  "name": "@workspace/ui",
  "exports": {
    "./primitives/*": "./src/primitives/*.tsx",
    "./chat/components/*": "./src/chat/components/*.tsx",
    "./chat/hooks/*": "./src/chat/hooks/*.ts",
    "./comment/components/*": "./src/comment/components/*.tsx",
    "./comment/hooks/*": "./src/comment/hooks/*.ts",
    "./wallet/components/*": "./src/wallet/components/*.tsx",
    "./wallet/hooks/*": "./src/wallet/hooks/*.ts",
    "./hooks/*": "./src/hooks/*.ts"
  }
}
```

---

## App-Specific Variants

When an app needs a different version of a shared component, **compose — never copy.**

```tsx
// packages/ui — shared component
export default function CommentSection({ className }: CommentSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <CommentList />
      <CommentForm />
    </div>
  )
}

// apps/extension — extension-specific wrapper
export default function SidePanelComments() {
  return (
    <ScrollArea className="h-screen">
      <CommentSection className="p-2 text-sm" />
    </ScrollArea>
  )
}
```

**Rules:**

- Shared component accepts `className` for visual customization.
- App wrapper handles layout context (scroll, padding, sizing).
- If the variant needs different **data** (not just styling), add props to the shared component.
- If the variant is fundamentally different in behavior, it belongs in `apps/[app]/src/components/`.

---

## Import Rules

### Path Aliases

```typescript
// In apps: @/ points to app's src/
import { SomePage } from "@/routes/some-page"

// Cross-package: @workspace/ namespace
import { Button } from "@workspace/ui/primitives/button"
import { useChat } from "@workspace/ui/chat/hooks/use-chat"
import { ChatClient } from "@workspace/domain/p2p/chat-client"
import { assert } from "@workspace/lib/assert"
import type { Nullable } from "@workspace/types/misc"
```

### Import Hierarchy

```
@workspace/types, @workspace/lib     (Level 1: Foundation)
         ↑
@workspace/domain                       (Level 2: Business logic)
         ↑
@workspace/ui                           (Level 3: React layer)
         ↑
@/  (app-local imports)                   (Level 4: App)
```

Higher levels import from lower levels. **Never the reverse.**

### Prohibited Imports

```typescript
// packages/domain importing React
import { useState } from "react"              // domain has no React dependency

// packages/lib importing from domain
import { ChatClient } from "../domain/..."    // lib is below domain

// apps/ importing stateful domain classes directly (bypass ui hooks)
import { ChatClient } from "@workspace/domain/p2p/chat-client"  // use ui hooks instead
// OK: stateless utilities and config from domain
// import { EIP6963Discovery } from "@workspace/domain/wallet/eip6963"

// Feature importing from another feature within packages/ui
import { useWallet } from "../wallet/hooks/use-wallet"  // extract to shared if needed
```

---

## Turborepo Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**", ".output/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "lint": {}
  }
}
```

**How caching works with this structure:**

- Modifying `packages/lib` → rebuilds `lib`, `domain`, `ui`, both apps.
- Modifying `packages/ui/src/chat/` → rebuilds `ui` and both apps. `domain` and `lib` stay cached.
- Modifying `apps/web/` → rebuilds only `apps/web`. Everything else stays cached.

The more granular the packages, the more cache hits.

---

## Adding a New Feature

Example: adding a "file-share" feature.

**Step 1 — Domain logic (if needed):**

```
packages/domain/src/file-share/
├── file-transfer.ts           # WebRTC data channel file transfer
└── file-transfer.type.ts      # FileChunk, TransferProgress types
```

**Step 2 — UI components and hooks:**

```
packages/ui/src/file-share/
├── components/
│   ├── file-drop-zone.tsx
│   └── file-transfer-progress.tsx
└── hooks/
    └── use-file-transfer.ts
```

**Step 3 — Update package exports:**

```json
{
  "./file-share/components/*": "./src/file-share/components/*.tsx",
  "./file-share/hooks/*": "./src/file-share/hooks/*.ts"
}
```

**Step 4 — Use in apps:**

```typescript
import { FileDropZone } from "@workspace/ui/file-share/components/file-drop-zone"
import { useFileTransfer } from "@workspace/ui/file-share/hooks/use-file-transfer"
```

---

## Extracting Code to packages/

When code in `apps/web/` is needed by `apps/extension/`:

1. Move the code to the appropriate package (`ui`, `domain`, or `lib`).
2. Update all imports in `apps/web/` to use the package path.
3. Import from the package in `apps/extension/`.
4. **Delete the original file from `apps/web/`.** Never leave a local copy behind.

Leaving local copies leads to divergence. This is the single most common source of technical debt in monorepos.

---

## FAQ

### Q: When should code move to packages/?

**A:** When a second app needs it. Not before (premature abstraction), not after (accumulated duplication).

### Q: Can features within packages/ui import from each other?

**A:** No. If `chat/` needs something from `wallet/`, extract the shared part to `primitives/` or `hooks/`. Features are isolated vertical slices.

### Q: Should every feature have both components/ and hooks/?

**A:** No. Create directories only when you need them. A feature with no hooks doesn't need a `hooks/` directory.

### Q: Why not a single packages/shared instead of multiple packages?

**A:** Three reasons:

1. **Dependency isolation.** `domain` has no React dependency. A single package would force React into non-React code.
2. **Build cache granularity.** Turborepo caches per package. Fewer packages = more cache invalidation.
3. **Circular dependency prevention.** pnpm catches circular imports between packages. Within a single package, there's no guard.

### Q: Why does apps/ not import domain directly?

**A:** `domain` classes are plain TypeScript with no React awareness. `ui/hooks` bridge them into React's lifecycle (state, effects, refs). Importing domain directly in a component means manually managing subscriptions and cleanup — error-prone and duplicated across every call site.
