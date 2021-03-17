import { map } from '@terra-dev/use-map';
import { testAddress, testClient, testWalletAddress } from 'base/test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../withdrawable';

describe('queries/withdrawable', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          bLunaHubContract: testAddress.bluna.hub,
          withdrawableAmountQuery: {
            withdrawable_unbonded: {
              address: testWalletAddress,
              block_time:
                Math.floor(Date.now() / 1000) - 1000 * 60 * 60 * 24 * 10,
            },
          },
          withdrawRequestsQuery: {
            unbond_requests: {
              address: testWalletAddress,
            },
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(Array.isArray(data.withdrawRequests?.requests)).toBeTruthy();
  });
});
