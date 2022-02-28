import { Redemption } from '@anchor-protocol/crossanchor-sdk';
import { useLocalStorageJson } from '@libs/use-local-storage';
import { useCallback } from 'react';

const REDEMPTIONS_STORAGE_KEY = '__anchor_cross_chain_redemptions';

type OutgoingSequence = number;
type Redemptions = { [key: OutgoingSequence]: Redemption };

export const useRedemptionStorage = () => {
  const [redemptions, setRedemptions] = useLocalStorageJson<Redemptions>(
    REDEMPTIONS_STORAGE_KEY,
    () => [],
  );

  const redemptionSaved = useCallback(
    (redemption: Redemption) =>
      Boolean(redemptions[redemption.outgoingSequence]),
    [redemptions],
  );

  const saveRedemption = useCallback(
    (redemption: Redemption) => {
      if (!redemptionSaved(redemption)) {
        setRedemptions({
          ...redemptions,
          [redemption.outgoingSequence]: redemption,
        });
      }
    },
    [redemptions, setRedemptions, redemptionSaved],
  );

  const removeRedemption = useCallback(
    (redemption: Redemption) => {
      if (redemptionSaved(redemption)) {
        delete redemptions[redemption.outgoingSequence];
        setRedemptions(redemptions);
      }
    },
    [redemptions, setRedemptions, redemptionSaved],
  );

  return { redemptions, saveRedemption, removeRedemption };
};
