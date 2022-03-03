import { Redemption as CrossChainRedemption } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const REDEMPTIONS_STORAGE_KEY = '__anchor_cross_chain_redemptions';

export type RedemptionDisplay = {
  action: string;
  amount?: string;
};

type OutgoingSequence = number;
export type Redemption = CrossChainRedemption & {
  display?: RedemptionDisplay;
  tx: ContractReceipt;
};
type Redemptions = { [key: OutgoingSequence]: Redemption };

export const useRedemptions = () => {
  const [redemptions, setRedemptions] = useLocalStorage<Redemptions>(
    REDEMPTIONS_STORAGE_KEY,
    {},
  );

  const saveRedemption = useCallback(
    (redemption: Redemption) => {
      setRedemptions({
        ...redemptions,
        [redemption.outgoingSequence]: redemption,
      });
    },
    [redemptions, setRedemptions],
  );

  const removeRedemption = useCallback(
    (outgoingSequence: OutgoingSequence) => {
      const { [outgoingSequence]: omit, ...rest } = redemptions;
      setRedemptions(rest);
    },
    [redemptions, setRedemptions],
  );

  const result = useMemo(
    () =>
      Object.values(redemptions).sort(
        (r1, r2) =>
          r2.tokenTransferVAA.timestamp - r1.tokenTransferVAA.timestamp,
      ),
    [redemptions],
  );

  return {
    redemptions: result,
    saveRedemption,
    removeRedemption,
  };
};
