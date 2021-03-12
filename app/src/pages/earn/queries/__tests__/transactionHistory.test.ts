import { map } from '@terra-dev/use-map';
import {
  testClient,
  testWalletAddress,
} from '@anchor-protocol/web-contexts/test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../transactionHistory';

describe('queries/transactionHistory', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          walletAddress: testWalletAddress,
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(Array.isArray(data.transactionHistory)).toBeTruthy();
  });
});
