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
    const { custodyBorrower, marketBorrowerInfo } = await borrowBorrowerQuery({
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
        custodyBorrower: {
          contractAddress: TEST_ADDRESSES.moneyMarket.custody,
          query: {
            borrower: {
              address: TEST_WALLET_ADDRESS,
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
    expect(custodyBorrower).not.toBeUndefined();
  });
});
