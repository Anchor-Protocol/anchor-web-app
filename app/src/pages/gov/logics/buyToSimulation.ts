import { min } from '@anchor-protocol/big-math';
import { Rate, uANC, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types/contracts';
import big, { Big, BigSource } from 'big.js';
import { MAX_SPREAD } from 'pages/gov/env';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';
import { Data as TaxData } from '@anchor-protocol/web-contexts/queries/tax';

export function buyToSimulation(
  simulation: terraswap.SimulationResponse<uANC>,
  fromAmount: uUST,
  { taxRate, maxTaxUUSD }: TaxData,
  fixedGas: uUST<BigSource>,
): TradeSimulation<uANC, uUST> {
  const beliefPrice = big(fromAmount).div(simulation.return_amount);

  const tax = min(
    big(fromAmount).mul(beliefPrice).mul(taxRate),
    maxTaxUUSD,
  ) as uUST<Big>;

  const expectedAmount = big(fromAmount)
    .mul(beliefPrice)
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
}
