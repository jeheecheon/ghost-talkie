import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Wallet, RefreshCw, X } from "lucide-react";
import type { EIP6963ProviderInfo } from "mipd";
import type { Nullable } from "@workspace/types/misc";
import { cn } from "@workspace/lib/cn";
import ResponsiveDialog from "@workspace/ui/primitives/responsive-dialog";
import { useInjectedWallet } from "@workspace/ui/wallet/context/injected-wallet-provider";
import { useWalletSelectDialog } from "@workspace/ui/wallet/context/wallet-select-dialog-provider";
import { ENV } from "@workspace/ui/configs/env";

export default function WalletSelectDialog() {
  const { discover, connect } = useInjectedWallet();
  const { isOpen, close } = useWalletSelectDialog();
  const [providers, setProviders] = useState<EIP6963ProviderInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Nullable<string>>(null);
  const [connectingRdns, setConnectingRdns] = useState<Nullable<string>>(null);

  const isEmpty = !isLoading && !error && providers.length === 0;
  const hasProviders = !isLoading && providers.length > 0;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void discoverProviders();
  }, [isOpen]);

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      title="Connect Wallet"
      description="Select a wallet to connect"
      onClose={close}
    >
      <div className="space-y-3 px-4">
        {isLoading && <ProviderListLoading />}
        {error && (
          <ProviderListError
            message={error}
            onDismiss={handleDismissError}
            onRetry={discoverProviders}
          />
        )}
        {isEmpty && <ProviderListEmpty />}
        {hasProviders && (
          <ul className="divide-y overflow-hidden rounded-lg border">
            {providers.map((provider) => (
              <li key={provider.rdns}>
                <ProviderOption
                  provider={provider}
                  isConnecting={connectingRdns === provider.rdns}
                  isDisabled={connectingRdns !== null}
                  onClick={handleSelect(provider)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-muted-foreground px-4 pb-1 text-center text-xs">
        By connecting, you agree to our{" "}
        <a
          className="underline underline-offset-2"
          href={ENV.PRIVACY_POLICY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
      </p>
    </ResponsiveDialog>
  );

  async function discoverProviders() {
    setProviders([]);
    setError(null);
    setIsLoading(true);
    const discovered = await discover();
    setProviders(discovered);
    setIsLoading(false);
  }

  function handleDismissError() {
    setError(null);
  }

  function handleSelect(provider: EIP6963ProviderInfo) {
    return async () => {
      setConnectingRdns(provider.rdns);
      setError(null);

      try {
        await connect(provider.rdns);
        close();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Connection rejected");
      } finally {
        setConnectingRdns(null);
      }
    };
  }
}

type ProviderListLoadingProps = {
  className?: string;
};

function ProviderListLoading({ className }: ProviderListLoadingProps) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
    </div>
  );
}

type ProviderListErrorProps = {
  className?: string;
  message: string;
  onDismiss: () => void;
  onRetry: () => void;
};

function ProviderListError({
  className,
  message,
  onDismiss,
  onRetry,
}: ProviderListErrorProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span className="flex-1">{message}</span>
      <div className="flex shrink-0 items-center gap-1">
        <button
          className="rounded p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
          type="button"
          aria-label="Retry"
          onClick={onRetry}
        >
          <RefreshCw className="size-3.5" />
        </button>
        <button
          className="rounded p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
          type="button"
          aria-label="Dismiss error"
          onClick={onDismiss}
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

type ProviderListEmptyProps = {
  className?: string;
};

function ProviderListEmpty({ className }: ProviderListEmptyProps) {
  return (
    <div className={cn("space-y-2 py-8 text-center", className)}>
      <Wallet className="text-muted-foreground mx-auto size-10" />
      <p className="font-medium">No wallet found</p>
      <p className="text-muted-foreground text-sm">
        Install a browser wallet extension to continue
      </p>
    </div>
  );
}

type ProviderOptionProps = {
  className?: string;
  provider: EIP6963ProviderInfo;
  isConnecting: boolean;
  isDisabled: boolean;
  onClick: () => void;
};

function ProviderOption({
  className,
  provider,
  isConnecting,
  isDisabled,
  onClick,
}: ProviderOptionProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 p-3 transition-colors",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset",
        "hover:bg-muted active:bg-muted/70",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isConnecting && "bg-muted",
        className,
      )}
      type="button"
      disabled={isDisabled}
      aria-busy={isConnecting}
      onClick={onClick}
    >
      <span className="relative shrink-0">
        {provider.icon ? (
          <img
            className="size-9 rounded-lg"
            src={provider.icon}
            alt={provider.name}
          />
        ) : (
          <span className="bg-muted flex size-9 items-center justify-center rounded-lg">
            <Wallet className="text-muted-foreground size-5" />
          </span>
        )}
        {isConnecting && (
          <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
            <Loader2 className="size-4 animate-spin text-white" />
          </span>
        )}
      </span>
      <span className="flex-1 text-left">
        <span className="block text-sm font-medium">{provider.name}</span>
        {isConnecting && (
          <span className="text-muted-foreground block text-xs">
            Connecting...
          </span>
        )}
      </span>
    </button>
  );
}
