import { defaultMantleFetch } from '@terra-money/webapp-fns';
import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '../../../test-env';
import { rewardsUstBorrowRewardsQuery } from '../ustBorrowRewards';

describe('queries/rewardsUSTBorrow', () => {
  test('should get result from query', async () => {
    const { marketState, borrowerInfo } = await rewardsUstBorrowRewardsQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      variables: {
        marketContract: TEST_ADDRESSES.moneyMarket.market,
        marketStateQuery: {
          state: {},
        },
        borrowerInfoQuery: {
          borrower_info: {
            borrower: TEST_WALLET_ADDRESS,
          },
        },
      },
    });

    expect(typeof marketState?.total_liabilities).toBe('string');
    expect(typeof +borrowerInfo.loan_amount).not.toBeNaN();
  });
});
