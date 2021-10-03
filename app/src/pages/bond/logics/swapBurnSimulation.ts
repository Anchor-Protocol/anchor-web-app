import type { bLuna, Luna, Rate, u, UST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import { AnchorTax } from '@anchor-protocol/app-fns';
import { min } from '@libs/big-math';
import big, { Big } from 'big.js';
import { MAX_SPREAD } from 'pages/bond/env';
import { SwapSimulation } from '../models/swapSimulation';

export function swapBurnSimulation(
  simulation: terraswap.pair.SimulationResponse<Luna>,
  getAmount: u<Luna>,
  { taxRate, maxTaxUUSD }: AnchorTax,
): SwapSimulation<Luna, bLuna> {
  const beliefPrice = big(1).div(big(simulation.return_amount).div(getAmount));
  const maxSpread = MAX_SPREAD;

  const tax = min(
    big(getAmount)
      .div(beliefPrice)
      .div(1 + taxRate),
    maxTaxUUSD,
  ) as u<UST<Big>>;
  const expectedAmount = big(getAmount).div(beliefPrice).minus(tax);
  const rate = big(1).minus(maxSpread);
  const minimumReceived = expectedAmount.mul(rate).toFixed() as u<Luna>;
  const swapFee = big(simulation.commission_amount)
    .plus(simulation.spread_amount)
    .toFixed() as u<Luna>;

  return {
    ...simulation,
    minimumReceived,
    swapFee,
    beliefPrice: beliefPrice.toFixed() as Rate,
    maxSpread: maxSpread.toString() as Rate,

    burnAmount: big(getAmount).div(beliefPrice).toString() as u<bLuna>,
  };
}
