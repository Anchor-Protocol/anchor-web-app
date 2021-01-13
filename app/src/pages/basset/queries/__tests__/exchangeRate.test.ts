import { testAddressProvider, testClient } from 'test.env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../exchangeRate';

describe('queries/exchangeRate', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bLunaHubContract: testAddressProvider.bAssetHub(''),
        }),
      })
      .then(({ data }) => parseData(data));

    expect(typeof data.actual_unbonded_amount).toBe('string');
  });
});
