import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { TEST_ADDRESSES, TEST_WALLET_ADDRESS } from '../../../test-env';
import { rewardsUstBorrowRewardsQuery } from '../ustBorrowRewards';

describe('queries/rewardsUSTBorrow', () => {
  test('should get result from query', async () => {
    const result = await rewardsUstBorrowRewardsQuery(
      TEST_WALLET_ADDRESS,
      TEST_ADDRESSES.moneyMarket.market,
      TEST_LCD_CLIENT,
    );

    expect(typeof result?.marketState?.total_liabilities).toBe('string');
    expect(typeof +result!.borrowerInfo.loan_amount).not.toBeNaN();
  });
});
