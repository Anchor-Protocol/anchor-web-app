import { TEST_HIVE_CLIENT } from '@libs/app-fns/test-env';
import { TEST_ADDRESSES, TEST_WALLET_ADDRESS } from '../../../test-env';
import { rewardsAncGovernanceRewardsQuery } from '../ancGovernanceRewards';

describe('queries/rewardsAncGovernance', () => {
  test('should get result from query', async () => {
    const result = await rewardsAncGovernanceRewardsQuery(
      TEST_WALLET_ADDRESS,
      TEST_ADDRESSES.anchorToken.gov,
      TEST_ADDRESSES.cw20.ANC,
      TEST_HIVE_CLIENT,
    );

    expect(typeof result?.userGovStakingInfo?.balance).toBe('string');
    expect(typeof result?.userANCBalance?.balance).toBe('string');
  });
});
