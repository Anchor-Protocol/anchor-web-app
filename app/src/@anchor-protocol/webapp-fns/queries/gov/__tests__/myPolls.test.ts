import { govMyPollsQuery } from '@anchor-protocol/webapp-fns';
import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@packages/mantle';

describe('queries/myPolls', () => {
  test('should get result from query', async () => {
    const myPolls = await govMyPollsQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      govContract: TEST_ADDRESSES.anchorToken.gov,
      walletAddress: TEST_WALLET_ADDRESS,
    });

    expect(Array.isArray(myPolls)).toBeTruthy();
  });
});
