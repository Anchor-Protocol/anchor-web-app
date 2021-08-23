import { aUST, moneyMarket, u, UST } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function computeTotalDeposit(
  userAUSTBalance: u<aUST> | undefined,
  moneyMarketEpochState: moneyMarket.market.EpochStateResponse | undefined,
) {
  return big(userAUSTBalance ?? '0').mul(
    moneyMarketEpochState?.exchange_rate ?? '1',
  ) as u<UST<Big>>;
}
