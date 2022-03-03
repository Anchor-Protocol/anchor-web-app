import { useMemo } from 'react';
import { Redemption, useRedemptions } from './useRedemptions';

export function useRedemption(
  outgoingSequence: number,
): Redemption | undefined {
  const { redemptions } = useRedemptions();
  const redemption = useMemo(
    () => redemptions.find((r) => r.outgoingSequence === outgoingSequence),
    [redemptions, outgoingSequence],
  );

  return redemption;
}
