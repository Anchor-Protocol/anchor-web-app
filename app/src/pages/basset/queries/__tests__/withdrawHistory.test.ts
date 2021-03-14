import { map } from '@terra-dev/use-map';
import { testAddress, testClient } from 'base/test.env';
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
          bLunaHubContract: testAddress.bluna.hub,
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
