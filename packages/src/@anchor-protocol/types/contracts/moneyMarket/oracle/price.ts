import { CW20Addr, StableDenom } from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

export interface Price {
  price: {
    base: CW20Addr;
    quote: StableDenom;
  };
}

export interface PriceResponse {
  rate: Rate;
  last_updated_base: number;
  last_updated_quote: number;
}
