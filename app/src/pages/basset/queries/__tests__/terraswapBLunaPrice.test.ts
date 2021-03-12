import { map } from '@terra-dev/use-map';
import {
  testAddress,
  testClient,
} from '@anchor-protocol/web-contexts/test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../terraswapBLunaPrice';

describe('queries/terraswapBLunaPrice', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          bLunaTerraswap: testAddress.terraswap.blunaLunaPair,
          poolInfoQuery: {
            pool: {},
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(parseInt(data.terraswapPoolInfo?.bLunaPrice ?? '')).not.toBeNaN();
  });
});
