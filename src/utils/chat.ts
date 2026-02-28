import { isAddressEqual, type Address } from "viem";
import { PeerRole } from "@/types/chat";

export function determineChatRole(args: {
  signerAddress: Address;
  roomAddress: Address;
}): PeerRole {
  return isAddressEqual(args.signerAddress, args.roomAddress)
    ? PeerRole.Owner
    : PeerRole.Visitor;
}
