import { moneyMarket, uaUST, uUST } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function computeTotalDeposit(
  userAUSTBalance: uaUST | undefined,
  moneyMarketEpochState: moneyMarket.market.EpochStateResponse | undefined,
) {
  return big(userAUSTBalance ?? '0').mul(
    moneyMarketEpochState?.exchange_rate ?? '1',
  ) as uUST<Big>;
}
