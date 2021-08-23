import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@libs/webapp-fns';
import { govPollsQuery } from '../polls';

describe('queries/polls', () => {
  test('should get result from query', async () => {
    const { polls } = await govPollsQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      wasmQuery: {
        polls: {
          contractAddress: TEST_ADDRESSES.anchorToken.gov,
          query: {
            polls: {
              limit: 6,
            },
          },
        },
      },
    });

    expect(Array.isArray(polls?.polls)).toBeTruthy();
  });
});
