import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient, testWalletAddress } from 'test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../claimable';

describe('queries/claimable', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          bAssetRewardContract: testAddressProvider.bAssetReward(''),
          rewardState: {
            state: {},
          },
          claimableRewardQuery: {
            holder: {
              address: testWalletAddress,
            },
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(data.rewardState).not.toBeUndefined();
    expect(data.claimableReward).not.toBeUndefined();
  });
});
