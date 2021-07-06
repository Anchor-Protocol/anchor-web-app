import type { Rate, terraswap, uToken } from '@anchor-protocol/types';

export interface SwapSimulation<Get extends uToken, Burn extends uToken>
  extends terraswap.SimulationResponse<Get> {
  beliefPrice: Rate;
  maxSpread: Rate;
  minimumReceived: Get;
  swapFee: Get;

  getAmount?: Get;
  burnAmount?: Burn;
}
