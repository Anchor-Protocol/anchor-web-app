import { min } from '@anchor-protocol/big-math';
import type { Rate, uANC, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';
import { Data as TaxData } from 'queries/tax';

export function sellToSimulation(
  simulation: terraswap.SimulationResponse<uUST>,
  burnAmount: uANC,
  { taxRate, maxTaxUUSD }: TaxData,
  fixedGas: uUST<BigSource>,
): TradeSimulation<uUST, uANC> {
  const beliefPrice = big(simulation.return_amount).div(burnAmount);
  const maxSpread = 0.1;

  const tax = min(
    big(simulation.return_amount).minus(
      big(simulation.return_amount).div(big(1).plus(taxRate)),
    ),
    maxTaxUUSD,
  ) as uUST<Big>;
  const expectedAmount = big(simulation.return_amount).minus(tax);
  const rate = big(1).minus(maxSpread);
  const minimumReceived = expectedAmount.mul(rate).toFixed() as uUST;
  const swapFee = big(simulation.commission_amount)
    .plus(simulation.spread_amount)
    .toFixed() as uUST;

  return {
    ...simulation,
    minimumReceived,
    swapFee,
    beliefPrice: beliefPrice.toFixed() as Rate,
    maxSpread: maxSpread.toString() as Rate,

    txFee: tax.plus(fixedGas).toFixed() as uUST,
    toAmount: big(burnAmount).div(beliefPrice).toString() as uUST,
  };
}
