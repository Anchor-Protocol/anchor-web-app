import { moneyMarket, u, UST } from '@anchor-protocol/types';
import { AnchorTokenBalances, AncPrice } from '@anchor-protocol/app-fns';
import { AnchorContractAddress } from '@anchor-protocol/app-provider';
import { sum, vectorMultiply } from '@libs/big-math';
import { Big } from 'big.js';

export function computeHoldings(
  tokenBalances: AnchorTokenBalances,
  ancPrice: AncPrice | undefined,
  contractAddress: AnchorContractAddress,
  oraclePrices: moneyMarket.oracle.PricesResponse | undefined,
) {
  if (!ancPrice || !oraclePrices) {
    return '0' as u<UST>;
  }

  const holdingsVector = [
    tokenBalances.uANC,
    tokenBalances.ubEth,
    tokenBalances.ubLuna,
  ];

  const bEthPrice =
    oraclePrices.prices.find(({ asset }) => asset === contractAddress.cw20.bEth)
      ?.price ?? 0;

  const bLunaPrice =
    oraclePrices.prices.find(
      ({ asset }) => asset === contractAddress.cw20.bLuna,
    )?.price ?? 0;

  const holdingsPriceVector = [ancPrice.ANCPrice, bEthPrice, bLunaPrice];

  const holdingsUst = vectorMultiply(holdingsVector, holdingsPriceVector);

  return sum(...holdingsUst) as u<UST<Big>>;
}
