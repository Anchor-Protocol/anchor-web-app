import { testAddressProvider, testClient } from 'test.env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../withdrawHistory';

describe('queries/withdrawHistory', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bLunaHubContract: testAddressProvider.bAssetHub(''),
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
      .then(({ data }) => parseData(data));

    expect(Array.isArray(data.allHistory.history)).toBeTruthy();
  });
});
