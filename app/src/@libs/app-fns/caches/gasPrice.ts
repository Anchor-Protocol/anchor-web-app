import { PersistCache } from '@libs/persist-cache';
import { GasPrice } from '../models/gasPrice';

export const gasPriceCache = new PersistCache<GasPrice>(
  '__terra_gas_price__',
  1000 * 60 * 5,
);
