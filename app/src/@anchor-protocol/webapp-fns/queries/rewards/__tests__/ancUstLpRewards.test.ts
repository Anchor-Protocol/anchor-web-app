import { defaultMantleFetch } from '@libs/mantle';
import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '../../../test-env';
import { rewardsAncUstLpRewardsQuery } from '../ancUstLpRewards';

describe('queries/rewardsAncUstLp', () => {
  test('should get result from query', async () => {
    const { userLPBalance, userLPStakingInfo } =
      await rewardsAncUstLpRewardsQuery({
        mantleFetch: defaultMantleFetch,
        mantleEndpoint: TEST_MANTLE_ENDPOINT,
        wasmQuery: {
          userLPBalance: {
            contractAddress: TEST_ADDRESSES.cw20.AncUstLP,
            query: {
              balance: {
                address: TEST_WALLET_ADDRESS,
              },
            },
          },
          userLPStakingInfo: {
            contractAddress: TEST_ADDRESSES.anchorToken.staking,
            query: {
              staker_info: {
                staker: TEST_WALLET_ADDRESS,
              },
            },
          },
        },
      });

    expect(typeof userLPBalance?.balance).toBe('string');
    expect(typeof userLPStakingInfo?.bond_amount).toBe('string');
  });
});
