import { testAddressProvider, testClient, testWalletAddress } from 'test.env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from 'queries/userBalances';

describe('queries/userBalances', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          walletAddress: testWalletAddress,
          bAssetTokenAddress: testAddressProvider.bAssetToken('bluna'),
          aTokenAddress: testAddressProvider.aToken(),
        }),
      })
      .then(({ data }) => parseData(data));

    expect(+data.uUSD).not.toBeNaN();
    expect(+data.uLuna).not.toBeNaN();
    expect(+data.ubLuna).not.toBeNaN();
    expect(+data.uaUST).not.toBeNaN();
  });
});
