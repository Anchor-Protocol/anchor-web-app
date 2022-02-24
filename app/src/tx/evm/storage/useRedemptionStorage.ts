import { useLocalStorageJson } from '@libs/use-local-storage';
import { useCallback } from 'react';

const REDEMPTION_STORAGE_KEY = '__anchor_cross_chain_redemption_sequences';

export const useRedemptionStorage = () => {
  const [redemptions, setRedemptions] = useLocalStorageJson<number[]>(
    REDEMPTION_STORAGE_KEY,
    () => [],
  );

  const saveRedemption = useCallback(
    (redemption: number) => {
      if (!redemptions.includes(redemption)) {
        setRedemptions([...redemptions, redemption]);
      }
    },
    [redemptions, setRedemptions],
  );

  const removeRedemption = useCallback(
    (redemption: number) => {
      if (redemptions.includes(redemption)) {
        setRedemptions(redemptions.filter((r) => r === redemption));
      }
    },
    [redemptions, setRedemptions],
  );

  return { redemptions, saveRedemption, removeRedemption };
};
