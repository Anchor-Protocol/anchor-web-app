import { min } from '@anchor-protocol/big-math';
import type { Rate, uANC, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { MAX_SPREAD } from 'pages/gov/env';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';
import { Data as TaxData } from 'queries/tax';

export function buyFromSimulation(
  simulation: terraswap.SimulationResponse<uANC, uUST>,
  toAmount: uANC,
  { taxRate, maxTaxUUSD }: TaxData,
  fixedGas: uUST<BigSource>,
): TradeSimulation<uANC, uUST, uUST> {
  const beliefPrice = big(simulation.return_amount).div(toAmount);

  const tax = min(
    big(simulation.return_amount).mul(taxRate),
    maxTaxUUSD,
  ) as uUST<Big>;

  const expectedAmount = big(simulation.return_amount)
    .div(beliefPrice)
    .minus(tax);

  const rate = big(1).minus(MAX_SPREAD);

  return {
    ...simulation,
    minimumReceived: expectedAmount.mul(rate).toFixed() as uANC,
    swapFee: big(simulation.commission_amount)
      .plus(simulation.spread_amount)
      .toFixed() as uANC,
    beliefPrice: beliefPrice.toFixed() as Rate,

    txFee: tax.plus(fixedGas).toFixed() as uUST,
    fromAmount: big(simulation.return_amount).toString() as uUST,
  };
}
