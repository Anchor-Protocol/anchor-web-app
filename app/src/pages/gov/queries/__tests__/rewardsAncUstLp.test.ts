import { map } from '@anchor-protocol/use-map';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../rewardsAncUstLp';
import { testAddressProvider, testClient, testWalletAddress } from 'test.env';

describe('queries/rewardsAncUstLp', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          ANCUST_LP_Token_contract: testAddressProvider.terraswapAncUstLPToken(),
          ANCUST_LP_Staking_contract: testAddressProvider.staking(),
          userWalletAddress: testWalletAddress,
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.userLPBalance?.balance).toBe('string');
    expect(typeof data.userLPStakingInfo?.bond_amount).toBe('string');
  });
});
