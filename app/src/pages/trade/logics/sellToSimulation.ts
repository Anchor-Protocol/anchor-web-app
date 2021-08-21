import type { Rate, uANC, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import { AnchorTax } from '@anchor-protocol/webapp-fns';
import { min } from '@packages/big-math';
import big, { Big, BigSource } from 'big.js';
import { MAX_SPREAD } from 'pages/trade/env';
import { TradeSimulation } from 'pages/trade/models/tradeSimulation';

export function sellToSimulation(
  simulation: terraswap.SimulationResponse<uUST, uANC>,
  fromAmount: uANC,
  { taxRate, maxTaxUUSD }: AnchorTax,
  fixedGas: uUST<BigSource>,
): TradeSimulation<uUST, uANC, uANC> | null {
  try {
    const beliefPrice = big(fromAmount).div(simulation.return_amount);

    const tax = min(
      big(simulation.return_amount).minus(
        big(simulation.return_amount).div(big(1).plus(taxRate)),
      ),
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
      beliefPrice: beliefPrice.toFixed() as Rate,

      txFee: tax.plus(fixedGas).toFixed() as uUST,
      toAmount: big(simulation.return_amount).toString() as uUST,
    };
  } catch {
    return null;
  }
}
