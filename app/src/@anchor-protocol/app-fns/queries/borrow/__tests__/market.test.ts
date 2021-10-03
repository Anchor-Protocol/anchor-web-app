import { TEST_ADDRESSES } from '@anchor-protocol/app-fns/test-env';
import { TEST_HIVE_CLIENT } from '@libs/app-fns/test-env';
import { borrowMarketQuery } from '../market';

describe('queries/market', () => {
  test('should get result from query', async () => {
    const { marketState, borrowRate, oraclePrices, overseerWhitelist } =
      await borrowMarketQuery(
        TEST_ADDRESSES.moneyMarket.market,
        TEST_ADDRESSES.moneyMarket.interestModel,
        TEST_ADDRESSES.moneyMarket.oracle,
        TEST_ADDRESSES.moneyMarket.overseer,
        TEST_HIVE_CLIENT,
      );

    expect(typeof marketState.total_liabilities).toBe('string');
    expect(borrowRate).not.toBeUndefined();
    expect(oraclePrices).not.toBeUndefined();
    expect(overseerWhitelist).not.toBeUndefined();
  });
});
