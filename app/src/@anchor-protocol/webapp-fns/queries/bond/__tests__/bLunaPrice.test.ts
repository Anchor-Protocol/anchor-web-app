import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@packages/webapp-fns';
import { bondBLunaPriceQuery } from '../bLunaPrice';

describe('queries/bLunaPrice', () => {
  test('should get result from query', async () => {
    const { bLunaPrice, terraswapPool } = await bondBLunaPriceQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      wasmQuery: {
        terraswapPool: {
          contractAddress: TEST_ADDRESSES.terraswap.blunaLunaPair,
          query: {
            pool: {},
          },
        },
      },
    });

    expect(parseInt(bLunaPrice)).not.toBeNaN();
    expect(terraswapPool).not.toBeUndefined();
  });
});
