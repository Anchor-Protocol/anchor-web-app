import { PersistCache } from '@libs/persist-cache';
import { GasPrice } from '../models/gasPrice';

export const gasPriceCache = new PersistCache<GasPrice>('__terra_gas_price__');
