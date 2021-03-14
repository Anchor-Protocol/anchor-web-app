import { min } from '@terra-dev/big-math';
import type { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import big, { Big } from 'big.js';
import { Data as TaxData } from 'base/queries/tax';
import { SwapSimulation } from '../models/swapSimulation';

export function swapBurnSimulation(
  simulation: terraswap.SimulationResponse<uLuna>,
  getAmount: uLuna,
  { taxRate, maxTaxUUSD }: TaxData,
): SwapSimulation<uLuna, ubLuna> {
  const beliefPrice = big(1).div(big(simulation.return_amount).div(getAmount));
  const maxSpread = 0.1;

  const tax = min(
    big(getAmount)
      .div(beliefPrice)
      .div(1 + taxRate),
    maxTaxUUSD,
  ) as uUST<Big>;
  const expectedAmount = big(getAmount).div(beliefPrice).minus(tax);
  const rate = big(1).minus(maxSpread);
  const minimumReceived = expectedAmount.mul(rate).toFixed() as uLuna;
  const swapFee = big(simulation.commission_amount)
    .plus(simulation.spread_amount)
    .toFixed() as uLuna;

  return {
    ...simulation,
    minimumReceived,
    swapFee,
    beliefPrice: beliefPrice.toFixed() as Rate,
    maxSpread: maxSpread.toString() as Rate,

    burnAmount: big(getAmount).div(beliefPrice).toString() as ubLuna,
  };
}
