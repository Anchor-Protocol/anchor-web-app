import type { Rate, ubLuna, uLuna } from '@anchor-protocol/types';

export interface SwapSimulation {
  minimumReceived: uLuna;
  swapFee: uLuna;
  beliefPrice: Rate;
  maxSpread: Rate;

  lunaAmount?: uLuna;
  bLunaAmount?: ubLuna;

  commission_amount: uLuna;
  return_amount: uLuna;
  spread_amount: uLuna;
}
