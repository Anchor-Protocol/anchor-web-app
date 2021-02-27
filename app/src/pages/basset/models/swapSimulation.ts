import type { Rate, terraswap, ubLuna, uLuna } from '@anchor-protocol/types';

export interface SwapSimulation extends terraswap.SimulationResponse<uLuna> {
  minimumReceived: uLuna;
  swapFee: uLuna;
  beliefPrice: Rate;
  maxSpread: Rate;

  lunaAmount?: uLuna;
  bLunaAmount?: ubLuna;
}
