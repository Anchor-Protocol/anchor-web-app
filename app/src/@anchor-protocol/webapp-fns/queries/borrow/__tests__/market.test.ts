import { uUST } from '@anchor-protocol/types';
import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@packages/webapp-fns';
import { borrowMarketQuery } from '../market';

describe('queries/market', () => {
  test('should get result from query', async () => {
    const { marketState, borrowRate, oraclePrices, overseerWhitelist } =
      await borrowMarketQuery({
        mantleFetch: defaultMantleFetch,
        mantleEndpoint: TEST_MANTLE_ENDPOINT,
        wasmQuery: {
          marketState: {
            contractAddress: TEST_ADDRESSES.moneyMarket.market,
            query: {
              state: {},
            },
          },
          overseerWhitelist: {
            contractAddress: TEST_ADDRESSES.moneyMarket.overseer,
            query: {
              whitelist: {},
            },
          },
          borrowRate: {
            contractAddress: TEST_ADDRESSES.moneyMarket.interestModel,
            query: {
              borrow_rate: {
                market_balance: '' as uUST,
                total_reserves: '' as uUST,
                total_liabilities: '' as uUST,
              },
            },
          },
          oraclePrices: {
            contractAddress: TEST_ADDRESSES.moneyMarket.oracle,
            query: {
              prices: {},
            },
          },
        },
      });

    expect(typeof marketState.total_liabilities).toBe('string');
    expect(borrowRate).not.toBeUndefined();
    expect(oraclePrices).not.toBeUndefined();
    expect(overseerWhitelist).not.toBeUndefined();
  });
});
