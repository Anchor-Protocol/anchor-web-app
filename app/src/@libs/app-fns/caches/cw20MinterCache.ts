import { PersistCache } from '@libs/persist-cache';
import { cw20 } from '@libs/types';

export const cw20MinterCache = new PersistCache<cw20.MinterResponse>(
  '__terra_cw20_minter__',
);
