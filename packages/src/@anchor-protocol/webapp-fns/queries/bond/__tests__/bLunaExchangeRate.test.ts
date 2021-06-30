import { defaultMantleFetch } from '@terra-money/webapp-fns';
import { TEST_ADDRESSES, TEST_MANTLE_ENDPOINT } from '../../../test-env';
import { bondBLunaExchangeRateQuery } from '../bLunaExchangeRate';

describe('queries/bLunaExchangeRate', () => {
  test('should get result from query', async () => {
    const { state, parameters } = await bondBLunaExchangeRateQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      wasmQuery: {
        state: {
          contractAddress: TEST_ADDRESSES.bluna.hub,
          query: {
            state: {},
          },
        },
        parameters: {
          contractAddress: TEST_ADDRESSES.bluna.hub,
          query: {
            parameters: {},
          },
        },
      },
    });

    expect(+state.exchange_rate).not.toBeNaN();
    expect(state).not.toBeUndefined();
    expect(parameters).not.toBeUndefined();
  });
});
