import { Rate, terraswap, uANC, uUST } from '@anchor-protocol/types';
import { AnchorTax } from '@anchor-protocol/webapp-fns';
import { min } from '@libs/big-math';
import big, { Big, BigSource } from 'big.js';
import { MAX_SPREAD } from 'pages/trade/env';
import { TradeSimulation } from 'pages/trade/models/tradeSimulation';

export function buyToSimulation(
  simulation: terraswap.SimulationResponse<uANC>,
  fromAmount: uUST,
  { taxRate, maxTaxUUSD }: AnchorTax,
  fixedGas: uUST<BigSource>,
): TradeSimulation<uANC, uUST> | null {
  try {
    const beliefPrice = big(fromAmount).div(simulation.return_amount);

    const tax = min(big(fromAmount).mul(taxRate), maxTaxUUSD) as uUST<Big>;

    const expectedAmount = big(fromAmount)
      .div(beliefPrice)
      .minus(tax) as uUST<Big>;

    const rate = big(1).minus(MAX_SPREAD) as Rate<Big>;

    return {
      ...simulation,
      minimumReceived: expectedAmount.mul(rate).toFixed() as uANC,
      swapFee: big(simulation.commission_amount)
        .plus(simulation.spread_amount)
        .toFixed() as uANC,
      beliefPrice: beliefPrice.toFixed() as Rate,

      txFee: tax.plus(fixedGas).toFixed() as uUST,
      toAmount: big(simulation.return_amount).toString() as uANC,
    };
  } catch {
    return null;
  }
}
