import {
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@packages/webapp-fns';
import { earnTransactionHistoryQuery } from '../transactionHistory';

describe('queries/transactionHistory', () => {
  test('should get result from query', async () => {
    const { transactionHistory } = await earnTransactionHistoryQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      variables: {
        walletAddress: TEST_WALLET_ADDRESS,
      },
    });

    expect(Array.isArray(transactionHistory)).toBeTruthy();
  });
});
