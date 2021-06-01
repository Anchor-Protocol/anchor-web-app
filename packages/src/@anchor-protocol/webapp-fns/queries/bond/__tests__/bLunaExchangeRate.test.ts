import { defaultMantleFetch } from '@terra-money/webapp-fns';
import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
} from '@anchor-protocol/webapp-fns/test-env';
import { bondBLunaExchangeRateQuery } from '../bLunaExchangeRate';

describe('queries/bLunaExchangeRate', () => {
  test('should get result from query', async () => {
    const { state, parameters } = await bondBLunaExchangeRateQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      variables: {
        bLunaHubContract: TEST_ADDRESSES.bluna.hub,
        stateQuery: {
          state: {},
        },
        parametersQuery: {
          parameters: {},
        },
      },
    });

    expect(+state.exchange_rate).not.toBeNaN();
    expect(state).not.toBeUndefined();
    expect(parameters).not.toBeUndefined();
  });
});
