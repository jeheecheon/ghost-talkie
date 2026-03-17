// @ts-expect-error no type declarations
import jazzicon from "@metamask/jazzicon";
import { useLayoutEffect, useRef } from "react";
import useEnsProfile from "@workspace/ui/wallet/hooks/use-ens-profile";
import { cn } from "@workspace/lib/cn";
import type { Maybe } from "@workspace/types/misc";
import type { Address } from "viem";
import Image from "@workspace/ui/primitives/image";

type AddressAvatarProps = {
  className?: string;
  address: Maybe<Address>;
};

export default function EnsAvatar({ className, address }: AddressAvatarProps) {
  const { data: ensProfile } = useEnsProfile({ address });

  return (
    <div className={cn("size-6 overflow-hidden rounded-full", className)}>
      {ensProfile?.avatar ? (
        <Image
          className="size-full object-cover"
          src={ensProfile.avatar}
          alt={`${address}'s ENS Avatar`}
        />
      ) : (
        <Jazzicon seed={address ? addressToSeed(address) : 0} />
      )}
    </div>
  );

  function addressToSeed(address: Address): number {
    return parseInt(address.slice(2, 10), 16);
  }
}

function Jazzicon({ seed }: { seed: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const icon = jazzicon(container.clientWidth || 32, seed);
    container.appendChild(icon);

    return () => {
      container.replaceChildren();
    };
  }, [seed]);

  return <div ref={containerRef} className="size-full" />;
}
