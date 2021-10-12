import { TEST_ADDRESSES } from '@anchor-protocol/app-fns/test-env';
import { TEST_HIVE_CLIENT } from '@libs/app-fns/test-env';
import { bondValidatorsQuery } from '../validators';

describe('queries/validators', () => {
  test('should get result from query', async () => {
    const { validators, whitelistedValidators } = await bondValidatorsQuery(
      TEST_ADDRESSES.bluna.hub,
      TEST_HIVE_CLIENT,
    );

    expect(Array.isArray(validators)).toBeTruthy();
    expect(Array.isArray(whitelistedValidators)).toBeTruthy();
  });
});
