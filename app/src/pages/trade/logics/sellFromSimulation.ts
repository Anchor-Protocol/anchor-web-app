import { ANC, Rate, terraswap, u, UST } from '@anchor-protocol/types';
import { AnchorTax } from '@anchor-protocol/app-fns';
import { min } from '@libs/big-math';
import big, { Big, BigSource } from 'big.js';
import { TradeSimulation } from 'pages/trade/models/tradeSimulation';

export function sellFromSimulation(
  simulation: terraswap.pair.SimulationResponse<UST, ANC>,
  toAmount: u<UST>,
  { taxRate, maxTaxUUSD }: AnchorTax,
  fixedGas: u<UST<BigSource>>,
  maxSpread: number,
): TradeSimulation<UST, ANC, ANC> | null {
  try {
    const beliefPrice = big(toAmount).div(simulation.return_amount);

    const tax = min(
      big(toAmount).minus(big(toAmount).div(big(1).plus(taxRate))),
      maxTaxUUSD,
    ) as u<UST<Big>>;

    const expectedAmount = big(simulation.return_amount).minus(tax);

    const rate = big(1).minus(maxSpread);

    return {
      ...simulation,
      minimumReceived: expectedAmount.mul(rate).toFixed() as u<UST>,
      swapFee: big(simulation.commission_amount)
        .plus(simulation.spread_amount)
        .toFixed() as u<UST>,
      beliefPrice: big(1).div(beliefPrice).toFixed() as Rate,

      txFee: tax.plus(fixedGas).toFixed() as u<UST>,
      fromAmount: big(simulation.return_amount).toString() as u<ANC>,
    };
  } catch {
    return null;
  }
}
