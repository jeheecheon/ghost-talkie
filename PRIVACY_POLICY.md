# Privacy Policy

**Last updated:** March 19, 2026

GhostTalkie is a peer-to-peer (P2P) chat browser extension that uses Web3 wallet addresses as user identities. This policy explains how the extension handles your data.

## Data We Collect

GhostTalkie does **not** collect, transmit, or store any personal data on external servers controlled by us.

## Data Stored Locally

The following data is stored locally on your device using your browser's local storage:

- **Bookmarks** — wallet addresses you have bookmarked
- **Search history** — wallet addresses you have previously searched
- **Theme preference** — your selected display theme

This data never leaves your device and can be cleared at any time through your browser settings.

## Third-Party Services

GhostTalkie connects to the following third-party services to function:

| Service | Purpose | Data Shared |
|---------|---------|-------------|
| **Nostr relays** (relay.damus.io, nos.lol) | P2P message delivery | Encrypted chat messages, public keys |
| **Reown (WalletConnect)** | Wallet connection | Wallet address, chain ID |
| **Blockchain RPC providers** | On-chain data queries | Wallet addresses queried |

These services have their own privacy policies. GhostTalkie does not control how they handle data.

## Peer-to-Peer Communication

Chat messages are transmitted through Nostr relays. Messages are exchanged directly between peers — GhostTalkie does not operate any servers that store or relay messages.

## Permissions

- **activeTab** — used to identify the current page context
- **storage** — used to persist local preferences
- **sidePanel** — used to display the extension interface

## Data Retention

All locally stored data persists until you manually clear it or uninstall the extension.

## Changes to This Policy

Updates will be posted on this page with a revised date.

## Contact

For questions about this policy, open an issue at [github.com/jeheecheon/ghosttalkie](https://github.com/jeheecheon/ghosttalkie).
