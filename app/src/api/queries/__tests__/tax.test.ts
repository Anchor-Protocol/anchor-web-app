import big from 'big.js';
import { testClient } from 'test.env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
} from '../tax';

describe('queries/tax', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
      })
      .then(({ data }) => parseData(data));

    expect(big(data.taxRate).gt(0)).toBeTruthy();
    expect(big(data.maxTaxUUSD).gt(0)).toBeTruthy();
  });
});
