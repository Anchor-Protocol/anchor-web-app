import { Rate, terraswap, uToken, uUST } from '@anchor-protocol/types';

export interface TradeSimulation<Get extends uToken, Burn extends uToken>
  extends terraswap.SimulationResponse<Get> {
  beliefPrice: Rate;
  maxSpread: Rate;
  minimumReceived: Get;
  swapFee: Get;

  txFee: uUST;

  getAmount?: Get;
  burnAmount?: Burn;
}
