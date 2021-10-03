import { TEST_HIVE_CLIENT } from '@libs/app-fns/test-env';
import { TEST_ADDRESSES } from '../../../test-env';
import { ancPriceQuery } from '../price';

describe('queries/ancPrice', () => {
  test('should get result from query', async () => {
    const { ancPrice } = await ancPriceQuery(
      TEST_ADDRESSES.terraswap.ancUstPair,
      TEST_HIVE_CLIENT,
    );

    expect(typeof ancPrice?.ANCPrice).toBe('string');
  });
});
