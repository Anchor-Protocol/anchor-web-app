import { TEST_ADDRESSES } from '@anchor-protocol/app-fns/test-env';
import { lastSyncedHeightQuery } from '@libs/app-fns';
import { TEST_HIVE_CLIENT } from '@libs/app-fns/test-env';
import { earnEpochStatesQuery } from '../epochStates';

describe('queries/epochStates', () => {
  test('should get result from query', async () => {
    const { moneyMarketEpochState, overseerEpochState } =
      await earnEpochStatesQuery(
        TEST_ADDRESSES.moneyMarket.market,
        TEST_ADDRESSES.moneyMarket.overseer,
        () => lastSyncedHeightQuery(TEST_HIVE_CLIENT),
        TEST_HIVE_CLIENT,
      );

    expect(typeof moneyMarketEpochState?.exchange_rate).toBe('string');
    expect(typeof overseerEpochState?.deposit_rate).toBe('string');
  });
});
