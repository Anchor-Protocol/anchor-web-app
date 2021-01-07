import { testAddressProvider, testClient, testWalletAddress } from 'env.test';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../withdrawable';

describe('queries/withdrawable', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bLunaHubContract: testAddressProvider.bAssetHub(''),
          withdrawableAmountQuery: {
            withdrawable_unbonded: {
              address: testWalletAddress,
              block_time: Date.now() - 1000 * 60 * 60 * 24 * 10,
            },
          },
          withdrawRequestsQuery: {
            unbond_requests: {
              address: testWalletAddress,
            },
          },
          exchangeRateQuery: {
            state: {},
          },
        }),
      })
      .then(({ data }) => parseData(data));

    expect(Array.isArray(data.withdrawRequests.requests)).toBeTruthy();
  });
});
