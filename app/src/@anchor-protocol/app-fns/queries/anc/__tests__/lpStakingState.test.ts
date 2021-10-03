import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { TEST_ADDRESSES } from '../../../test-env';
import { ancLpStakingStateQuery } from '../lpStakingState';

describe('queries/lpStakingState', () => {
  test('should get result from query', async () => {
    const { lpStakingState } = await ancLpStakingStateQuery(
      TEST_ADDRESSES.anchorToken.staking,
      TEST_LCD_CLIENT,
    );

    expect(typeof lpStakingState?.total_bond_amount).toBe('string');
  });
});
