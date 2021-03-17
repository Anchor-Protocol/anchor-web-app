import type { uaUST, uUST } from '@anchor-protocol/types';
import { cw20, moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function totalDepositUST(
  aUSTBalance: cw20.BalanceResponse<uaUST> | undefined,
  epochState: moneyMarket.market.EpochStateResponse | undefined,
) {
  return big(aUSTBalance?.balance ?? '0').mul(
    epochState?.exchange_rate ?? '1',
  ) as uUST<Big>;
}
