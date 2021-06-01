import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-money/webapp-fns';
import { bondBLunaPriceQuery } from '../bLunaPrice';

describe('queries/bLunaPrice', () => {
  test('should get result from query', async () => {
    const { bLunaPrice, terraswapPool } = await bondBLunaPriceQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      variables: {
        bLunaLunaPairContract: TEST_ADDRESSES.terraswap.blunaLunaPair,
        terraswapPoolQuery: {
          pool: {},
        },
      },
    });

    expect(parseInt(bLunaPrice)).not.toBeNaN();
    expect(terraswapPool).not.toBeUndefined();
  });
});
