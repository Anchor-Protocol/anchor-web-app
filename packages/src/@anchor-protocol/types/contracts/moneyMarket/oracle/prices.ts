import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { PriceResponse } from '@anchor-protocol/types/contracts/moneyMarket/oracle/price';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#prices
 */
export interface Prices {
  prices: {
    start_after?: HumanAddr;
    limit?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#pricesresponse
 */
export interface PricesResponse {
  prices: Array<PriceResponse>;
}
