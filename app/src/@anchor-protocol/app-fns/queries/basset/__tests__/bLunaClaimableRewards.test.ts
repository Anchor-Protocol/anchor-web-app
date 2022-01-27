import {
  TEST_ADDRESSES,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/app-fns/test-env';
import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { bLunaClaimableRewardsQuery } from '../bLunaClaimableRewards';

describe('queries/claimableRewards', () => {
  test('should get result from query', async () => {
    const result = await bLunaClaimableRewardsQuery(
      TEST_WALLET_ADDRESS,
      TEST_ADDRESSES.bluna.reward,
      TEST_LCD_CLIENT,
    );

    expect(result?.rewardState).not.toBeUndefined();
    expect(result?.claimableReward).not.toBeUndefined();
  });
});
