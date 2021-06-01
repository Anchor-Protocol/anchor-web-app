import type { Rate, uANC, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import { AnchorTax } from '@anchor-protocol/webapp-fns';
import { min } from '@terra-dev/big-math';
import big, { Big, BigSource } from 'big.js';
import { MAX_SPREAD } from 'pages/gov/env';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';

export function buyFromSimulation(
  simulation: terraswap.SimulationResponse<uANC, uUST>,
  toAmount: uANC,
  { taxRate, maxTaxUUSD }: AnchorTax,
  fixedGas: uUST<BigSource>,
): TradeSimulation<uANC, uUST, uUST> | null {
  try {
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
  } catch {
    return null;
  }
}
