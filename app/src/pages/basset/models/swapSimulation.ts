import { Ratio, ubLuna, uLuna } from '@anchor-protocol/notation';

export interface SwapSimulation {
  minimumReceived: uLuna;
  swapFee: uLuna;
  beliefPrice: Ratio;
  maxSpread: Ratio;

  lunaAmount?: uLuna;
  bLunaAmount?: ubLuna;

  commission_amount: uLuna;
  return_amount: uLuna;
  spread_amount: uLuna;
}
