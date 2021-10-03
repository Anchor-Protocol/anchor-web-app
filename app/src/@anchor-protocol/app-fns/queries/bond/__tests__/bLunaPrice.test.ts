import { TEST_ADDRESSES } from '@anchor-protocol/app-fns/test-env';
import { TEST_HIVE_CLIENT } from '@libs/app-fns/test-env';
import { bondBLunaPriceQuery } from '../bLunaPrice';

describe('queries/bLunaPrice', () => {
  test('should get result from query', async () => {
    const { bLunaPrice, terraswapPool } = await bondBLunaPriceQuery(
      TEST_ADDRESSES.terraswap.blunaLunaPair,
      TEST_HIVE_CLIENT,
    );

    expect(parseInt(bLunaPrice)).not.toBeNaN();
    expect(terraswapPool).not.toBeUndefined();
  });
});
