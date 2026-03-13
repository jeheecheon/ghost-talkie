import { isAddressEqual, type Address } from "viem";
import { PeerRole } from "@workspace/domain/p2p/types";

export function determineChatRole(args: {
  signerAddress: Address;
  roomAddress: Address;
}): PeerRole {
  return isAddressEqual(args.signerAddress, args.roomAddress)
    ? PeerRole.Owner
    : PeerRole.Visitor;
}
