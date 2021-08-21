import type { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import { AnchorTax } from '@anchor-protocol/webapp-fns';
import { min } from '@packages/big-math';
import big, { Big } from 'big.js';
import { MAX_SPREAD } from 'pages/bond/env';
import { SwapSimulation } from '../models/swapSimulation';

export function swapGetSimulation(
  simulation: terraswap.SimulationResponse<uLuna>,
  burnAmount: ubLuna,
  { taxRate, maxTaxUUSD }: AnchorTax,
): SwapSimulation<uLuna, ubLuna> {
  const beliefPrice = big(simulation.return_amount).div(burnAmount);
  const maxSpread = MAX_SPREAD;

  const tax = min(
    big(burnAmount).mul(beliefPrice).mul(taxRate),
    maxTaxUUSD,
  ) as uUST<Big>;
  const expectedAmount = big(burnAmount).mul(beliefPrice).minus(tax);
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

    getAmount: big(burnAmount).mul(beliefPrice).toString() as uLuna,
  };
}
