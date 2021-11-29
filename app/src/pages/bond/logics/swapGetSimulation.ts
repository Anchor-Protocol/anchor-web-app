import type { bLuna, Luna, Rate, u, UST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import { AnchorTax } from '@anchor-protocol/app-fns';
import { min } from '@libs/big-math';
import big, { Big } from 'big.js';
import { SwapSimulation } from '../models/swapSimulation';

export function swapGetSimulation(
  simulation: terraswap.pair.SimulationResponse<Luna>,
  burnAmount: u<bLuna>,
  { taxRate, maxTaxUUSD }: AnchorTax,
  maxSpread: number,
): SwapSimulation<Luna, bLuna> {
  const beliefPrice = big(simulation.return_amount).div(burnAmount);

  const tax = min(
    big(burnAmount).mul(beliefPrice).mul(taxRate),
    maxTaxUUSD,
  ) as u<UST<Big>>;
  const expectedAmount = big(burnAmount).mul(beliefPrice).minus(tax);
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

    getAmount: big(burnAmount).mul(beliefPrice).toString() as u<Luna>,
  };
}
