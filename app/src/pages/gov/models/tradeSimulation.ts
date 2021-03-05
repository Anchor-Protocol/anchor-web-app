import { Rate, terraswap, uToken, uUST } from '@anchor-protocol/types';

export interface TradeSimulation<
  To extends uToken,
  From extends uToken,
  R extends uToken = To
> extends terraswap.SimulationResponse<To, R> {
  beliefPrice: Rate;
  maxSpread: Rate;
  minimumReceived: To;
  swapFee: To;

  txFee: uUST;

  toAmount?: To;
  fromAmount?: From;
}
