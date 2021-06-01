import { defaultMantleFetch } from '@terra-money/webapp-fns';
import {
  TEST_ADDRESSES,
  TEST_MANTLE_ENDPOINT,
  TEST_WALLET_ADDRESS,
} from '../../../test-env';
import { rewardsAncGovernanceRewardsQuery } from '../ancGovernanceRewards';

describe('queries/rewardsAncGovernance', () => {
  test('should get result from query', async () => {
    const {
      userANCBalance,
      userGovStakingInfo,
    } = await rewardsAncGovernanceRewardsQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      variables: {
        ancContract: TEST_ADDRESSES.cw20.ANC,
        govContract: TEST_ADDRESSES.anchorToken.gov,
        govStakeInfoQuery: {
          staker: {
            address: TEST_WALLET_ADDRESS,
          },
        },
        userAncBalanceQuery: {
          balance: {
            address: TEST_WALLET_ADDRESS,
          },
        },
      },
    });

    expect(typeof userGovStakingInfo?.balance).toBe('string');
    expect(typeof userANCBalance?.balance).toBe('string');
  });
});
