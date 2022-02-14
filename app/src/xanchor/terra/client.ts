import { LCDClient } from '@terra-money/terra.js';

export const terra = new LCDClient({
  URL: 'terra_lcd_url',
  chainID: 'terra_chain_id',
});
