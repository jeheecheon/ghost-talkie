export class AppUrlBuilder {
  static WalletRoom(addressOrEns: string) {
    return `/${addressOrEns}`;
  }

  static Chat(addressOrEns: string) {
    return `/${addressOrEns}/chat`;
  }
}
