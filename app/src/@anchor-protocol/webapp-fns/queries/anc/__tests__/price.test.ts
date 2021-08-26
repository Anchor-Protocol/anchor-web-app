import { TEST_ADDRESSES, TEST_MANTLE_ENDPOINT } from '../../../test-env';
import { ancPriceQuery } from '../price';

describe('queries/ancPrice', () => {
  test('should get result from query', async () => {
    const { ancPrice } = await ancPriceQuery(
      TEST_ADDRESSES.terraswap.ancUstPair,
      TEST_MANTLE_ENDPOINT,
    );

    expect(typeof ancPrice?.ANCPrice).toBe('string');
  });
});
