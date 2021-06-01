import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-money/webapp-fns';
import { bondClaimableRewardsQuery } from '../claimableRewards';

describe('queries/claimableRewards', () => {
  test('should get result from query', async () => {
    const { rewardState, claimableReward } = await bondClaimableRewardsQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      variables: {
        bAssetRewardContract: TEST_ADDRESSES.bluna.reward,
        rewardStateQuery: {
          state: {},
        },
        rewardHolderQuery: {
          holder: {
            address: TEST_WALLET_ADDRESS,
          },
        },
      },
    });

    expect(rewardState).not.toBeUndefined();
    expect(claimableReward).not.toBeUndefined();
  });
});
