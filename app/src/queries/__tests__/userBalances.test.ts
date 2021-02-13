import { map } from '@anchor-protocol/use-map';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from 'queries/userBalances';
import { testAddressProvider, testClient, testWalletAddress } from 'test.env';

describe('queries/userBalances', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          walletAddress: testWalletAddress,
          bAssetTokenAddress: testAddressProvider.bAssetToken('bluna'),
          aTokenAddress: testAddressProvider.aToken(),
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(+data.uUSD!).not.toBeNaN();
    expect(+data.uLuna!).not.toBeNaN();
    expect(+data.ubLuna!).not.toBeNaN();
    expect(+data.uaUST!).not.toBeNaN();
  });
});
