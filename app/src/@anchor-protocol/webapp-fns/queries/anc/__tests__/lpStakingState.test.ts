import { TEST_ADDRESSES, TEST_MANTLE_ENDPOINT } from '../../../test-env';
import { ancLpStakingStateQuery } from '../lpStakingState';

describe('queries/lpStakingState', () => {
  test('should get result from query', async () => {
    const { lpStakingState } = await ancLpStakingStateQuery(
      TEST_ADDRESSES.anchorToken.staking,
      TEST_MANTLE_ENDPOINT,
    );

    expect(typeof lpStakingState?.total_bond_amount).toBe('string');
  });
});
