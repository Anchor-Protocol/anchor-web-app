import type { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import { AnchorTax } from '@anchor-protocol/webapp-fns';
import { min } from '@libs/big-math';
import big, { Big } from 'big.js';
import { MAX_SPREAD } from 'pages/bond/env';
import { SwapSimulation } from '../models/swapSimulation';

export function swapBurnSimulation(
  simulation: terraswap.SimulationResponse<uLuna>,
  getAmount: uLuna,
  { taxRate, maxTaxUUSD }: AnchorTax,
): SwapSimulation<uLuna, ubLuna> {
  const beliefPrice = big(1).div(big(simulation.return_amount).div(getAmount));
  const maxSpread = MAX_SPREAD;

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
