import { cn } from "@workspace/lib/cn";
import AddressSearchForm from "@workspace/ui/search/components/address-search-form";
import useSearchHistory from "@workspace/ui/search/hooks/use-search-history";
import type { Address } from "viem";

type SearchSectionProps = {
  className?: string;
  onSearch: (address: Address, ensName?: string) => void;
};

export default function SearchSection({
  className,
  onSearch,
}: SearchSectionProps) {
  const { addEntry } = useSearchHistory();

  return (
    <section className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Search Wallets</h1>
        <p className="text-muted-foreground text-sm">
          Look up any wallet by address or ENS name
        </p>
      </div>
      <AddressSearchForm onSearch={handleSearch} />
    </section>
  );

  function handleSearch(address: Address, ensName?: string) {
    addEntry(address, ensName);
    onSearch(address, ensName);
  }
}
