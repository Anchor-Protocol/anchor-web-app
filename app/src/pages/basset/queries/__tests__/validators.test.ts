import { testAddressProvider, testClient } from 'env.test';
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

    expect(Array.isArray(data.validators.Result)).toBeTruthy();
  });
});
