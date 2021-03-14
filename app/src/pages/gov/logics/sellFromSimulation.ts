import { min } from '@terra-dev/big-math';
import { Rate, uANC, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types/contracts';
import big, { Big, BigSource } from 'big.js';
import { MAX_SPREAD } from 'pages/gov/env';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';
import { Data as TaxData } from 'base/queries/tax';

export function sellFromSimulation(
  simulation: terraswap.SimulationResponse<uUST, uANC>,
  toAmount: uUST,
  { taxRate, maxTaxUUSD }: TaxData,
  fixedGas: uUST<BigSource>,
): TradeSimulation<uUST, uANC, uANC> {
  const beliefPrice = big(toAmount).div(simulation.return_amount);

  const tax = min(
    big(toAmount).minus(big(toAmount).div(big(1).plus(taxRate))),
    maxTaxUUSD,
  ) as uUST<Big>;

  const expectedAmount = big(simulation.return_amount).minus(tax);

  const rate = big(1).minus(MAX_SPREAD);

  return {
    ...simulation,
    minimumReceived: expectedAmount.mul(rate).toFixed() as uUST,
    swapFee: big(simulation.commission_amount)
      .plus(simulation.spread_amount)
      .toFixed() as uUST,
    beliefPrice: big(1).div(beliefPrice).toFixed() as Rate,

    txFee: tax.plus(fixedGas).toFixed() as uUST,
    fromAmount: big(simulation.return_amount).toString() as uANC,
  };
}
