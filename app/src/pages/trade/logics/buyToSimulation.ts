import { ANC, Rate, terraswap, u, UST } from '@anchor-protocol/types';
import { AnchorTax } from '@anchor-protocol/app-fns';
import { min } from '@libs/big-math';
import big, { Big, BigSource } from 'big.js';
import { TradeSimulation } from 'pages/trade/models/tradeSimulation';

export function buyToSimulation(
  simulation: terraswap.pair.SimulationResponse<ANC>,
  fromAmount: u<UST>,
  { taxRate, maxTaxUUSD }: AnchorTax,
  fixedGas: u<UST<BigSource>>,
  maxSpread: number,
): TradeSimulation<ANC, UST> | null {
  try {
    const beliefPrice = big(fromAmount).div(simulation.return_amount);

    const tax = min(big(fromAmount).mul(taxRate), maxTaxUUSD) as u<UST<Big>>;

    const expectedAmount = big(fromAmount).div(beliefPrice).minus(tax) as u<
      UST<Big>
    >;

    const rate = big(1).minus(maxSpread) as Rate<Big>;

    return {
      ...simulation,
      minimumReceived: expectedAmount.mul(rate).toFixed() as u<ANC>,
      swapFee: big(simulation.commission_amount)
        .plus(simulation.spread_amount)
        .toFixed() as u<ANC>,
      beliefPrice: beliefPrice.toFixed() as Rate,

      txFee: tax.plus(fixedGas).toFixed() as u<UST>,
      toAmount: big(simulation.return_amount).toString() as u<ANC>,
    };
  } catch {
    return null;
  }
}
