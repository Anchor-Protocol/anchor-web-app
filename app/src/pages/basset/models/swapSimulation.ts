import type { Rate, terraswap, uToken } from '@anchor-protocol/types';

export interface SwapSimulation<Get extends uToken, Burn extends uToken>
  extends terraswap.SimulationResponse<Get> {
  minimumReceived: Get;
  swapFee: Get;
  beliefPrice: Rate;
  maxSpread: Rate;

  getAmount?: Get;
  burnAmount?: Burn;
}
