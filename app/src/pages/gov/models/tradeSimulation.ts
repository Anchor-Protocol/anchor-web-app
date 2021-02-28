import { Rate, terraswap, uToken, uUST } from '@anchor-protocol/types';

export interface TradeSimulation<To extends uToken, From extends uToken>
  extends terraswap.SimulationResponse<To> {
  beliefPrice: Rate;
  maxSpread: Rate;
  minimumReceived: To;
  swapFee: To;

  txFee: uUST;

  toAmount?: To;
  fromAmount?: From;
}
