import { StableDenom, uUST } from '@anchor-protocol/types';
import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-money/webapp-fns';
import { borrowMarketQuery } from '../market';

describe('queries/market', () => {
  test('should get result from query', async () => {
    const { marketState, borrowRate, oraclePrice, overseerWhitelist } =
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
              whitelist: {
                collateral_token: TEST_ADDRESSES.cw20.bLuna,
              },
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
          oraclePrice: {
            contractAddress: TEST_ADDRESSES.moneyMarket.oracle,
            query: {
              price: {
                base: TEST_ADDRESSES.cw20.bLuna,
                quote: 'uusd' as StableDenom,
              },
            },
          },
        },
      });

    expect(typeof marketState.total_liabilities).toBe('string');
    expect(borrowRate).not.toBeUndefined();
    expect(oraclePrice).not.toBeUndefined();
    expect(overseerWhitelist).not.toBeUndefined();
  });
});
