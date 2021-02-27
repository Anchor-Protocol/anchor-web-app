import { min } from '@anchor-protocol/big-math';
import type { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import big, { Big } from 'big.js';
import { Data as TaxData } from 'queries/tax';
import { SwapSimulation } from '../models/swapSimulation';

export function askSimulation(
  askSimulation: terraswap.SimulationResponse<uLuna>,
  getAmount: uLuna,
  { taxRate, maxTaxUUSD }: TaxData,
): SwapSimulation {
  const beliefPrice = big(1).div(
    big(askSimulation.return_amount).div(getAmount),
  );
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
  const swapFee = big(askSimulation.commission_amount)
    .plus(askSimulation.spread_amount)
    .toFixed() as uLuna;

  return {
    ...askSimulation,
    minimumReceived,
    swapFee,
    beliefPrice: beliefPrice.toFixed() as Rate,
    maxSpread: maxSpread.toString() as Rate,

    bLunaAmount: big(getAmount).div(beliefPrice).toString() as ubLuna,
  };
}
