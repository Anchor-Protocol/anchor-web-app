import { testAddressProvider, testClient } from 'test.env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../validators';

describe('queries/validators', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bLunaHubContract: testAddressProvider.bAssetHub(''),
        }),
      })
      .then(({ data }) => parseData(data));

    expect(Array.isArray(data.validators)).toBeTruthy();
  });
});
