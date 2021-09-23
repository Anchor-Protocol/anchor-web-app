import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@libs/mantle';
import { lastSyncedHeightQuery } from '@libs/webapp-fns';
import { earnEpochStatesQuery } from '../epochStates';

describe('queries/epochStates', () => {
  test('should get result from query', async () => {
    const { moneyMarketEpochState, overseerEpochState } =
      await earnEpochStatesQuery({
        mantleFetch: defaultMantleFetch,
        mantleEndpoint: TEST_MANTLE_ENDPOINT,
        lastSyncedHeight: () =>
          lastSyncedHeightQuery({
            mantleEndpoint: TEST_MANTLE_ENDPOINT,
            mantleFetch: defaultMantleFetch,
          }),
        wasmQuery: {
          moneyMarketEpochState: {
            contractAddress: TEST_ADDRESSES.moneyMarket.market,
            query: {
              epoch_state: {
                block_height: -1,
              },
            },
          },
          overseerEpochState: {
            contractAddress: TEST_ADDRESSES.moneyMarket.overseer,
            query: {
              epoch_state: {},
            },
          },
        },
      });

    expect(typeof moneyMarketEpochState?.exchange_rate).toBe('string');
    expect(typeof overseerEpochState?.deposit_rate).toBe('string');
  });
});
