import { testAddressProvider, testClient } from 'test.env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../marketBalanceOverview';

export async function getMarketBalance() {
  return await testClient
    .query<StringifiedData, StringifiedVariables>({
      query,
      variables: stringifyVariables({
        marketContractAddress: testAddressProvider.market('uusd'),
        marketStateQuery: {
          state: {},
        },
      }),
    })
    .then(({ data }) => parseData(data));
}

describe('queries/marketBalanceOverview', () => {
  test('should get result from query', async () => {
    const data = await getMarketBalance();
    expect(typeof data.marketState.total_liabilities).toBe('string');
  });
});
