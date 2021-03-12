import { map } from '@terra-dev/use-map';
import {
  testAddress,
  testClient,
  testWalletAddress,
} from '@anchor-protocol/web-contexts/test.env';
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
          ANCUST_LP_Token_contract: testAddress.cw20.AncUstLP,
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
