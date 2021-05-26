import { StableDenom, uUST } from '@anchor-protocol/types';
import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-money/webapp-fns';
import { borrowMarketQuery } from '../market';

describe('queries/market', () => {
  test('should get result from query', async () => {
    const {
      marketState,
      borrowRate,
      oraclePrice,
      overseerWhitelist,
    } = await borrowMarketQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      variables: {
        marketContract: TEST_ADDRESSES.moneyMarket.market,
        marketStateQuery: {
          state: {},
        },
        interestContract: TEST_ADDRESSES.moneyMarket.interestModel,
        interestBorrowRateQuery: {
          borrow_rate: {
            market_balance: '0' as uUST,
            total_liabilities: '0' as uUST,
            total_reserves: '0' as uUST,
          },
        },
        oracleContract: TEST_ADDRESSES.moneyMarket.oracle,
        oracleQuery: {
          price: {
            base: TEST_ADDRESSES.cw20.bLuna,
            quote: 'uusd' as StableDenom,
          },
        },
        overseerContract: TEST_ADDRESSES.moneyMarket.overseer,
        overseerWhitelistQuery: {
          whitelist: {
            collateral_token: TEST_ADDRESSES.cw20.bLuna,
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
