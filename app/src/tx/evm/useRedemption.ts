import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEffect, useState } from 'react';
import { Redemption } from '@anchor-protocol/crossanchor-sdk';

type RedemptionResponse = {
  redemption: Redemption | undefined;
  loading: boolean;
};

export function useRedemption(outgoingSequence: number): RedemptionResponse {
  const [redemption, setRedemption] = useState<Redemption>();
  const [loading, setLoading] = useState<boolean>(false);
  const { connection } = useEvmWallet();
  const evmSdk = useEvmCrossAnchorSdk();

  useEffect(() => {
    setLoading(true);

    evmSdk
      .redemption(outgoingSequence)
      .then((payload) => setRedemption(payload))
      .finally(() => setLoading(false));
  }, [evmSdk, outgoingSequence]);

  const result = (connection && redemption) ?? undefined;

  return { redemption: result, loading };
}
