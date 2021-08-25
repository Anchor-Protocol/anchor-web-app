import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/webapp-fns/test-env';
import { bondBEthClaimableRewardsQuery } from '../bEthClaimableRewards';

describe('queries/bEthClaimableRewards', () => {
  test('should get result from query', async () => {
    const { claimableReward } = await bondBEthClaimableRewardsQuery(
      TEST_ADDRESSES.beth.reward,
      TEST_WALLET_ADDRESS,
      TEST_MANTLE_ENDPOINT,
    );

    expect(claimableReward).not.toBeUndefined();
  });
});
