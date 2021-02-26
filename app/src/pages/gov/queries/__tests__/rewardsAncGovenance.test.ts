import { map } from '@anchor-protocol/use-map';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../rewardsAncGovernance';
import { testAddressProvider, testClient, testWalletAddress } from 'test.env';

describe('queries/rewardsAncGovernance', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          ANC_Gov_contract: testAddressProvider.gov(),
          ANC_token_contract: testAddressProvider.ANC(),
          userWalletAddress: testWalletAddress,
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.userGovStakingInfo?.balance).toBe('string');
    expect(typeof data.userANCBalance?.balance).toBe('string');
  });
});
