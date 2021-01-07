import { testClient, testAddressProvider, testWalletAddress } from 'env.test';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../totalDeposit';

describe('queries/totalDeposit', () => {
  test('should get result from query', async () => {
    const data = await testClient.query<StringifiedData, StringifiedVariables>({
      query,
      variables: stringifyVariables({
        anchorTokenContract: testAddressProvider.aToken(),
        anchorTokenBalanceQuery: {
          balance: {
            address: testWalletAddress,
          },
        },
        moneyMarketContract: testAddressProvider.market(''),
        moneyMarketEpochQuery: {
          epoch_state: {},
        },
      }),
    }).then(({ data }) => parseData(data));

    expect(typeof data.totalDeposit).toBe('string');
  });
});
