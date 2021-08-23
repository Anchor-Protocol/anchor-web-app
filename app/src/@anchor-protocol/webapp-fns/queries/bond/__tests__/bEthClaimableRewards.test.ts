import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@libs/webapp-fns';
import { bondBEthClaimableRewardsQuery } from '../bEthClaimableRewards';

describe('queries/bEthClaimableRewards', () => {
  test('should get result from query', async () => {
    const { claimableReward } = await bondBEthClaimableRewardsQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      wasmQuery: {
        claimableReward: {
          contractAddress: TEST_ADDRESSES.beth.reward,
          query: {
            accrued_rewards: {
              address: TEST_WALLET_ADDRESS,
            },
          },
        },
      },
    });

    expect(claimableReward).not.toBeUndefined();
  });
});
