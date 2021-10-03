import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { TEST_ADDRESSES, TEST_WALLET_ADDRESS } from '../../../test-env';
import { rewardsAncUstLpRewardsQuery } from '../ancUstLpRewards';

describe('queries/rewardsAncUstLp', () => {
  test('should get result from query', async () => {
    const result = await rewardsAncUstLpRewardsQuery(
      TEST_WALLET_ADDRESS,
      TEST_ADDRESSES.anchorToken.staking,
      TEST_ADDRESSES.cw20.AncUstLP,
      TEST_LCD_CLIENT,
    );

    expect(typeof result?.userLPBalance?.balance).toBe('string');
    expect(typeof result?.userLPStakingInfo?.bond_amount).toBe('string');
  });
});
