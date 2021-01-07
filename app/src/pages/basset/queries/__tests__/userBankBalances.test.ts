import { testClient, testWalletAddress } from 'env.test';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../userBankBalances';

describe('queries/userBankBalances', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          userAddress: testWalletAddress,
        }),
      })
      .then(({ data }) => parseData(data));

    expect(typeof data.has('uluna')).toBeTruthy();
  });
});
