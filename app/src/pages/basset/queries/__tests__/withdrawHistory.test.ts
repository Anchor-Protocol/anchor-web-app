import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient } from 'test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../withdrawHistory';

describe('queries/withdrawHistory', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          bLunaHubContract: testAddressProvider.blunaHub(),
          allHistory: {
            all_history: {
              start_from: 1,
              limit: 100,
            },
          },
          parameters: {
            parameters: {},
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(Array.isArray(data.allHistory?.history)).toBeTruthy();
  });
});
