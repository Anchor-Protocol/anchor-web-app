import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEffect, useState } from 'react';
import {
  Redemption,
  useRedemptionStorage,
} from './storage/useRedemptionStorage';

type RedemptionResponse = {
  redemption: Redemption | undefined;
  loading: boolean;
};

export function useRedemption(outgoingSequence: number): RedemptionResponse {
  const { redemptions } = useRedemptionStorage();
  const [redemption, setRedemption] = useState<Redemption | undefined>(
    redemptions.find((r) => r.outgoingSequence === outgoingSequence),
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { connection } = useEvmWallet();
  const evmSdk = useEvmCrossAnchorSdk();

  useEffect(() => {
    setLoading(true);

    evmSdk
      .redemption(outgoingSequence)
      .then((resp) => setRedemption({ ...redemption, ...resp }))
      .finally(() => setLoading(false));
  }, [evmSdk, outgoingSequence, redemption]);

  const result = (connection && redemption) ?? undefined;

  return { redemption: result, loading };
}
