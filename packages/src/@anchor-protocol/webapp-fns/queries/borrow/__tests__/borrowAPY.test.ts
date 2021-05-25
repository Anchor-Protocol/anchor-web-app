import { defaultMantleFetch } from '@terra-money/webapp-fns';
import { TEST_MANTLE_ENDPOINT } from '../../test-env';
import { borrowAPYQuery } from '../apy';

describe('queries/borrowAPY', () => {
  test('should get result from query', async () => {
    const {
      borrowerDistributionAPYs,
      lpRewards,
      govRewards,
    } = await borrowAPYQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
    });

    expect(Array.isArray(borrowerDistributionAPYs)).toBeTruthy();
    expect(Array.isArray(govRewards)).toBeTruthy();
    expect(Array.isArray(lpRewards)).toBeTruthy();
  });
});
