import { map } from '@anchor-protocol/use-map';
import { testAddress, testClient, testWalletAddress } from '../../test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../userBalances';

describe('queries/userBalances', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          walletAddress: testWalletAddress,
          bAssetTokenAddress: testAddress.cw20.bLuna,
          aTokenAddress: testAddress.cw20.aUST,
          ANCTokenAddress: testAddress.cw20.ANC,
          bLunaLunaLPTokenAddress: testAddress.cw20.bLunaLunaLP,
          AncUstLPTokenAddress: testAddress.cw20.AncUstLP,
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(+data.uUSD!).not.toBeNaN();
    expect(+data.uLuna!).not.toBeNaN();
    expect(+data.ubLuna!).not.toBeNaN();
    expect(+data.uaUST!).not.toBeNaN();
  });
});
