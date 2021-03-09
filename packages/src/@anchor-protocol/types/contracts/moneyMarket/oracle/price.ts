import { CW20Addr, StableDenom } from '@anchor-protocol/types/contracts/common';
import { UST } from '@anchor-protocol/types/currencies';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#price
 */
export interface Price {
  price: {
    base: CW20Addr;
    quote: StableDenom;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#priceresponse
 */
export interface PriceResponse {
  rate: UST;
  last_updated_base: number;
  last_updated_quote: number;
}
