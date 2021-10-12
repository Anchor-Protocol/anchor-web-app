import {
  TEST_ADDRESSES,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/app-fns/test-env';
import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { bondBEthClaimableRewardsQuery } from '../bEthClaimableRewards';

describe('queries/bEthClaimableRewards', () => {
  test('should get result from query', async () => {
    const result = await bondBEthClaimableRewardsQuery(
      TEST_WALLET_ADDRESS,
      TEST_ADDRESSES.beth.reward,
      TEST_LCD_CLIENT,
    );

    expect(result?.claimableReward).not.toBeUndefined();
  });
});
