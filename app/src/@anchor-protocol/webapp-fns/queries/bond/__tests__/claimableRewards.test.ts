import {
  TEST_ADDRESSES,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/webapp-fns/test-env';
import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { bondClaimableRewardsQuery } from '../claimableRewards';

describe('queries/claimableRewards', () => {
  test('should get result from query', async () => {
    const result = await bondClaimableRewardsQuery(
      TEST_WALLET_ADDRESS,
      TEST_ADDRESSES.bluna.reward,
      TEST_LCD_CLIENT,
    );

    expect(result?.rewardState).not.toBeUndefined();
    expect(result?.claimableReward).not.toBeUndefined();
  });
});
