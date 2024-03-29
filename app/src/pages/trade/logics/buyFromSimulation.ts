import type { ANC, Rate, u, UST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import { AnchorTax } from '@anchor-protocol/webapp-fns';
import { min } from '@libs/big-math';
import big, { Big, BigSource } from 'big.js';
import { MAX_SPREAD } from 'pages/trade/env';
import { TradeSimulation } from 'pages/trade/models/tradeSimulation';

export function buyFromSimulation(
  simulation: terraswap.SimulationResponse<ANC, UST>,
  toAmount: u<ANC>,
  { taxRate, maxTaxUUSD }: AnchorTax,
  fixedGas: u<UST<BigSource>>,
): TradeSimulation<ANC, UST, UST> | null {
  try {
    const beliefPrice = big(simulation.return_amount).div(toAmount);

    const tax = min(
      big(simulation.return_amount).mul(taxRate),
      maxTaxUUSD,
    ) as u<UST<Big>>;

    const expectedAmount = big(simulation.return_amount)
      .div(beliefPrice)
      .minus(tax);

    const rate = big(1).minus(MAX_SPREAD);

    return {
      ...simulation,
      minimumReceived: expectedAmount.mul(rate).toFixed() as u<ANC>,
      swapFee: big(simulation.commission_amount)
        .plus(simulation.spread_amount)
        .toFixed() as u<ANC>,
      beliefPrice: beliefPrice.toFixed() as Rate,

      txFee: tax.plus(fixedGas).toFixed() as u<UST>,
      fromAmount: big(simulation.return_amount).toString() as u<UST>,
    };
  } catch {
    return null;
  }
}
