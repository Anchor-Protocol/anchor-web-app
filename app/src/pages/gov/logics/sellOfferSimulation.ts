import { min } from '@anchor-protocol/big-math';
import type { Rate, uANC, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';
import { Data as TaxData } from 'queries/tax';

export function sellOfferSimulation(
  offerSimulation: terraswap.SimulationResponse<uUST>,
  burnAmount: uANC,
  { taxRate, maxTaxUUSD }: TaxData,
  fixedGas: uUST<BigSource>,
): TradeSimulation<uUST, uANC> {
  const beliefPrice = big(offerSimulation.return_amount).div(burnAmount);
  const maxSpread = 0.1;

  const tax = min(
    big(offerSimulation.return_amount).minus(
      big(offerSimulation.return_amount).div(big(1).plus(taxRate)),
    ),
    maxTaxUUSD,
  ) as uUST<Big>;
  const expectedAmount = big(offerSimulation.return_amount).minus(tax);
  const rate = big(1).minus(maxSpread);
  const minimumReceived = expectedAmount.mul(rate).toFixed() as uUST;
  const swapFee = big(offerSimulation.commission_amount)
    .plus(offerSimulation.spread_amount)
    .toFixed() as uUST;

  return {
    ...offerSimulation,
    minimumReceived,
    swapFee,
    beliefPrice: beliefPrice.toFixed() as Rate,
    maxSpread: maxSpread.toString() as Rate,

    txFee: tax.plus(fixedGas).toFixed() as uUST,
    getAmount: big(burnAmount).div(beliefPrice).toString() as uUST,
  };

  //const expectedAmount = big(askSimulation.return_amount).minus(tax);
  //const rate = big(1).minus(maxSpread);
  //const minimumReceived = expectedAmount.mul(rate).toFixed() as uUST;
  //const swapFee = big(askSimulation.commission_amount)
  //  .plus(askSimulation.spread_amount)
  //  .toFixed() as uUST;
  //
  //return {
  //  ...askSimulation,
  //  minimumReceived,
  //  swapFee,
  //  beliefPrice: beliefPrice.toFixed() as Rate,
  //  maxSpread: maxSpread.toString() as Rate,
  //
  //  txFee: tax.plus(fixedGas).toFixed() as uUST,
  //  burnAmount: big(getAmount).div(beliefPrice).toString() as uANC,
  //};
}
