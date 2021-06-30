import { StableDenom } from '@anchor-protocol/types';
import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/webapp-fns/test-env';
import {
  defaultMantleFetch,
  lastSyncedHeightQuery,
} from '@terra-money/webapp-fns';
import { borrowLiquidationPriceQuery } from '../liquidationPrice';

describe('queries/liquidationPrice', () => {
  test('should get result from query', async () => {
    const { liquidationPrice } = await borrowLiquidationPriceQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      lastSyncedHeight: () =>
        lastSyncedHeightQuery({
          mantleFetch: defaultMantleFetch,
          mantleEndpoint: TEST_MANTLE_ENDPOINT,
        }),
      wasmQuery: {
        marketBorrowerInfo: {
          contractAddress: TEST_ADDRESSES.moneyMarket.market,
          query: {
            borrower_info: {
              borrower: TEST_WALLET_ADDRESS,
              block_height: 0,
            },
          },
        },
        overseerBorrowLimit: {
          contractAddress: TEST_ADDRESSES.moneyMarket.overseer,
          query: {
            borrow_limit: {
              borrower: TEST_WALLET_ADDRESS,
              block_time: 0,
            },
          },
        },
        overseerCollaterals: {
          contractAddress: TEST_ADDRESSES.moneyMarket.overseer,
          query: {
            collaterals: {
              borrower: TEST_WALLET_ADDRESS,
              block_height: 0,
            },
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
        oraclePriceInfo: {
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

    expect(+(liquidationPrice ?? '0')).toBeGreaterThan(0);
  });
});
