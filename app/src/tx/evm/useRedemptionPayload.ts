import { useEthCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEffect, useState } from 'react';
import { RedemptionPayload } from '@anchor-protocol/crossanchor-sdk/lib/esm/crossanchor/base/wormhole';

export function useRedemptionPayload(
  outgoingSequence: number,
): RedemptionPayload | undefined {
  const [redemptionPayload, setRedemptionPayload] =
    useState<RedemptionPayload>();
  const { provider, connection } = useEvmWallet();
  const ethSdk = useEthCrossAnchorSdk('testnet', provider);

  useEffect(() => {
    ethSdk
      .redemptionPayload(outgoingSequence)
      .then((payload) => setRedemptionPayload(payload));
  }, [ethSdk, outgoingSequence]);

  return (connection && redemptionPayload) ?? undefined;
}
