import { min } from '@anchor-protocol/big-math';
import type { Rate, uANC, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';
import { Data as TaxData } from 'queries/tax';

export function buyAskSimulation(
  askSimulation: terraswap.SimulationResponse<uANC>,
  getAmount: uANC,
  { taxRate, maxTaxUUSD }: TaxData,
  fixedGas: uUST<BigSource>,
): TradeSimulation<uANC, uUST> {
  const beliefPrice = big(getAmount).div(askSimulation.return_amount);
  const maxSpread = 0.1;

  const tax = min(
    big(askSimulation.return_amount).mul(taxRate),
    maxTaxUUSD,
  ) as uUST<Big>;
  const expectedAmount = big(askSimulation.return_amount)
    .div(beliefPrice)
    .minus(tax);
  const rate = big(1).minus(maxSpread);
  const minimumReceived = expectedAmount.mul(rate).toFixed() as uANC;
  const swapFee = big(askSimulation.commission_amount)
    .plus(askSimulation.spread_amount)
    .toFixed() as uANC;

  return {
    ...askSimulation,
    minimumReceived,
    swapFee,
    beliefPrice: beliefPrice.toFixed() as Rate,
    maxSpread: maxSpread.toString() as Rate,

    txFee: tax.plus(fixedGas).toFixed() as uUST,
    burnAmount: big(getAmount).div(beliefPrice).toString() as uUST,
  };
}
