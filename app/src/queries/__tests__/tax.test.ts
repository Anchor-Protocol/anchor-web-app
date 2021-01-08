import big from 'big.js';
import { testClient } from 'env.test';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../tax';

describe('queries/tax', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          Denom: 'uusd',
        }),
      })
      .then(({ data }) => parseData(data));

    expect(big(data.tax_rate.Result).gt(0)).toBeTruthy();
  });
});
