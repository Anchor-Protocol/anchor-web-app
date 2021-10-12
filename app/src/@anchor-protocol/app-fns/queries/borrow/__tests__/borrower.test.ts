import {
  TEST_ADDRESSES,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/app-fns/test-env';
import { lastSyncedHeightQuery } from '@libs/app-fns';
import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { borrowBorrowerQuery } from '../borrower';

describe('queries/borrower', () => {
  test('should get result from query', async () => {
    const result = await borrowBorrowerQuery(
      TEST_WALLET_ADDRESS,
      () => lastSyncedHeightQuery(TEST_LCD_CLIENT),
      TEST_ADDRESSES.moneyMarket.market,
      TEST_ADDRESSES.moneyMarket.overseer,
      TEST_LCD_CLIENT,
    );

    expect(result?.marketBorrowerInfo).not.toBeUndefined();
    expect(result?.overseerCollaterals).not.toBeUndefined();
    expect(result?.overseerBorrowLimit).not.toBeUndefined();
  });
});
