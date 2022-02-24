import { useEthCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEffect, useState } from 'react';
import { RedemptionPayload } from '@anchor-protocol/crossanchor-sdk/lib/esm/crossanchor/base/wormhole';

type RedemptionPayloadResponse = {
  redemptionPayload: RedemptionPayload | undefined;
  loading: boolean;
};

export function useRedemptionPayload(
  outgoingSequence: number,
): RedemptionPayloadResponse {
  const [redemptionPayload, setRedemptionPayload] =
    useState<RedemptionPayload>();
  const [loading, setLoading] = useState<boolean>(false);
  const { provider, connection } = useEvmWallet();
  const ethSdk = useEthCrossAnchorSdk('testnet', provider);

  useEffect(() => {
    setLoading(true);

    ethSdk
      .redemptionPayload(outgoingSequence)
      .then((payload) => setRedemptionPayload(payload))
      .finally(() => setLoading(false));
  }, [ethSdk, outgoingSequence]);

  const result = (connection && redemptionPayload) ?? undefined;

  return { redemptionPayload: result, loading };
}
