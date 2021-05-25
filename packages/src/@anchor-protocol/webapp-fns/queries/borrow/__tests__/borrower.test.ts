import {
  defaultMantleFetch,
  lastSyncedHeightQuery,
} from '@terra-money/webapp-fns';
import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '../../test-env';
import { borrowBorrowerQuery } from '../borrower';

describe('queries/borrower', () => {
  test('should get result from query', async () => {
    const { custodyBorrower, marketBorrowerInfo } = await borrowBorrowerQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      variables: {
        marketContract: TEST_ADDRESSES.moneyMarket.market,
        marketBorrowerInfoQuery: {
          borrower_info: {
            borrower: TEST_WALLET_ADDRESS,
            block_height: 0,
          },
        },
        custodyContract: TEST_ADDRESSES.moneyMarket.custody,
        custodyBorrowerQuery: {
          borrower: {
            address: TEST_WALLET_ADDRESS,
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
