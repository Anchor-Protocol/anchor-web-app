import { PersistCache } from '@libs/persist-cache';
import { cw20, Token } from '@libs/types';

export const cw20TokenInfoCache = new PersistCache<
  cw20.TokenInfoResponse<Token>
>('__terra_token_info__');
