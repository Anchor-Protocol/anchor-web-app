import { testAddressProvider, testClient, testWalletAddress } from 'env.test';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../claimable';

describe('queries/claimable', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
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
      .then(({ data }) => parseData(data));

    expect(!!data.rewardState).toBeTruthy();
  });
});
