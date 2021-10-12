import { PersistCache } from '@libs/persist-cache';

export const airdropStageCache = new PersistCache<number[]>(
  '__anchor_claimed_airdrop_stages__',
);
