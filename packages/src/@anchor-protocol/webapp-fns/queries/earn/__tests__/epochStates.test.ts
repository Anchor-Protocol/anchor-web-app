import {
  defaultMantleFetch,
  lastSyncedHeightQuery,
} from '@terra-money/webapp-fns';
import { TEST_ADDRESSES, TEST_MANTLE_ENDPOINT } from '../../test-env';
import { earnEpochStatesQuery } from '../epochStates';

describe('queries/epochStates', () => {
  test('should get result from query', async () => {
    const {
      moneyMarketEpochState,
      overseerEpochState,
    } = await earnEpochStatesQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      lastSyncedHeight: () =>
        lastSyncedHeightQuery({
          mantleEndpoint: TEST_MANTLE_ENDPOINT,
          mantleFetch: defaultMantleFetch,
        }),
      variables: {
        moneyMarketContract: TEST_ADDRESSES.moneyMarket.market,
        overseerContract: TEST_ADDRESSES.moneyMarket.overseer,
        moneyMarketEpochStateQuery: {
          epoch_state: {
            block_height: -1,
          },
        },
        overseerEpochStateQuery: {
          epoch_state: {},
        },
      },
    });

    expect(typeof moneyMarketEpochState?.exchange_rate).toBe('string');
    expect(typeof overseerEpochState?.deposit_rate).toBe('string');
  });
});
