import {
  TEST_ADDRESSES,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/app-fns/test-env';
import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { bAssetInfoAndBalanceTotalQuery } from '../bAssetInfoAndBalanceTotal';

describe('bAssetAndBalanceTotal()', () => {
  test('should get result from query', async () => {
    const result = await bAssetInfoAndBalanceTotalQuery(
      TEST_WALLET_ADDRESS,
      TEST_ADDRESSES.moneyMarket.overseer,
      TEST_ADDRESSES.moneyMarket.oracle,
      TEST_LCD_CLIENT,
    );

    console.log('bAssetInfoAndBalanceTotal.test.ts..()', result);
  });
});
