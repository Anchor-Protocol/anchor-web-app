import type { Rate, terraswap, Token, u } from '@anchor-protocol/types';

export interface SwapSimulation<Get extends Token, Burn extends Token>
  extends terraswap.pair.SimulationResponse<Get> {
  beliefPrice: Rate;
  //maxSpread: Rate;
  minimumReceived: u<Get>;
  swapFee: u<Get>;

  getAmount?: u<Get>;
  burnAmount?: u<Burn>;
}
