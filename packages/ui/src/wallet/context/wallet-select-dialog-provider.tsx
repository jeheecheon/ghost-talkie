import {
  createContext,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import WalletSelectDialog from "@workspace/ui/wallet/components/wallet-select-dialog";

type WalletSelectDialogContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const WalletSelectDialogContext = createContext<WalletSelectDialogContextValue>(
  {
    isOpen: false,
    open: () => {},
    close: () => {},
  },
);

export function useWalletSelectDialog() {
  return useContext(WalletSelectDialogContext);
}

export default function WalletSelectDialogProvider({
  children,
}: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <WalletSelectDialogContext.Provider value={{ isOpen, open, close }}>
      {children}
      <WalletSelectDialog />
    </WalletSelectDialogContext.Provider>
  );
}
