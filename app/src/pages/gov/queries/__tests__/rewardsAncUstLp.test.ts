import { map } from '@anchor-protocol/use-map';
import { testAddress, testClient, testWalletAddress } from 'test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../rewardsAncUstLp';

describe('queries/rewardsAncUstLp', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          ANCUST_LP_Token_contract: testAddress.terraswap.ancUstLPToken,
          ANCUST_LP_Staking_contract: testAddress.anchorToken.staking,
          UserLPStakingInfoQuery: {
            staker_info: {
              staker: testWalletAddress,
            },
          },
          ANCUSTLPBalanceQuery: {
            balance: {
              address: testWalletAddress,
            },
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.userLPBalance?.balance).toBe('string');
    expect(typeof data.userLPStakingInfo?.bond_amount).toBe('string');
  });
});
