import { testAddressProvider, testClient } from 'test.env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../terraswapBLunaPrice';

describe('queries/terraswapBLunaPrice', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bLunaTerraswap: testAddressProvider.blunaBurnPair(),
        }),
      })
      .then(({ data }) => parseData(data));

    expect(+data.bLunaPrice).not.toBeNaN();
  });
});
