import { testAddressProvider, testClient, testWalletAddress } from 'env.test';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../userBAssetBalance';

describe('queries/userBAssetBalance', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bAssetTokenContract: testAddressProvider.bAssetToken(''),
          bAssetBalanceQuery: {
            balance: {
              address: testWalletAddress,
            },
          },
        }),
      })
      .then(({ data }) => parseData(data));

    expect(parseInt(data.bAssetBalance.balance)).not.toBeNaN();
  });
});
