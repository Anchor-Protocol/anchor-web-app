import { defaultMantleFetch } from '@libs/webapp-fns';
import { TEST_ADDRESSES, TEST_MANTLE_ENDPOINT } from '../../../test-env';
import { ancPriceQuery } from '../price';

describe('queries/ancPrice', () => {
  test('should get result from query', async () => {
    const { ancPrice } = await ancPriceQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      wasmQuery: {
        ancPrice: {
          contractAddress: TEST_ADDRESSES.terraswap.ancUstPair,
          query: {
            pool: {},
          },
        },
      },
    });

    expect(typeof ancPrice?.ANCPrice).toBe('string');
  });
});
