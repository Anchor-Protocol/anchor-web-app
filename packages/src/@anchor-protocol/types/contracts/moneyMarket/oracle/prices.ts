import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { PriceResponse } from '@anchor-protocol/types/contracts/moneyMarket/oracle/price';

export interface Prices {
  prices: {
    start_after?: HumanAddr;
    limit?: number;
  };
}

export interface PricesResponse {
  prices: Array<PriceResponse>;
}
