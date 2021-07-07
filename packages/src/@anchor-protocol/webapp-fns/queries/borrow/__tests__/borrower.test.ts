import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/webapp-fns/test-env';
import {
  defaultMantleFetch,
  lastSyncedHeightQuery,
} from '@terra-money/webapp-fns';
import { borrowBorrowerQuery } from '../borrower';

describe('queries/borrower', () => {
  test('should get result from query', async () => {
    const { marketBorrowerInfo, overseerCollaterals, overseerBorrowLimit } =
      await borrowBorrowerQuery({
        mantleFetch: defaultMantleFetch,
        mantleEndpoint: TEST_MANTLE_ENDPOINT,
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
          overseerCollaterals: {
            contractAddress: TEST_ADDRESSES.moneyMarket.overseer,
            query: {
              collaterals: {
                borrower: TEST_WALLET_ADDRESS,
              },
            },
          },
          overseerBorrowLimit: {
            contractAddress: TEST_ADDRESSES.moneyMarket.overseer,
            query: {
              borrow_limit: {
                borrower: TEST_WALLET_ADDRESS,
                block_time: -1,
              },
            },
          },
        },
        lastSyncedHeight: () =>
          lastSyncedHeightQuery({
            mantleFetch: defaultMantleFetch,
            mantleEndpoint: TEST_MANTLE_ENDPOINT,
          }),
      });

    expect(marketBorrowerInfo).not.toBeUndefined();
    expect(overseerCollaterals).not.toBeUndefined();
    expect(overseerBorrowLimit).not.toBeUndefined();
  });
});
