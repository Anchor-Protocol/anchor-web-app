import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-money/webapp-fns';
import { govPollsQuery } from '../polls';

describe('queries/polls', () => {
  test('should get result from query', async () => {
    const { polls } = await govPollsQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      variables: {
        govContract: TEST_ADDRESSES.anchorToken.gov,
        pollsQuery: {
          polls: {
            limit: 6,
          },
        },
      },
    });

    expect(Array.isArray(polls?.polls)).toBeTruthy();
  });
});
