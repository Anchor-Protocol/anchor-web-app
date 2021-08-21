import { defaultMantleFetch } from '@packages/webapp-fns';
import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
} from '@anchor-protocol/webapp-fns/test-env';
import { bondValidatorsQuery } from '../validators';

describe('queries/validators', () => {
  test('should get result from query', async () => {
    const { validators, whitelistedValidators } = await bondValidatorsQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      wasmQuery: {
        hubWhitelistedValidators: {
          contractAddress: TEST_ADDRESSES.bluna.hub,
          query: {
            whitelisted_validators: {},
          },
        },
      },
    });

    expect(Array.isArray(validators)).toBeTruthy();
    expect(Array.isArray(whitelistedValidators)).toBeTruthy();
  });
});
