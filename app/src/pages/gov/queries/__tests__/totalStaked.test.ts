import { map } from '@anchor-protocol/use-map';
import {
  testAddress,
  testAddressProvider,
  testClient,
} from '@anchor-protocol/web-contexts/test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../totalStaked';

describe('queries/totalStaked', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          ANCTokenContract: testAddress.cw20.ANC,
          ANCTokenBalanceQuery: {
            balance: {
              address: testAddress.anchorToken.gov,
            },
          },
          GovConfigQuery: {
            config: {},
          },
          GovStateQuery: {
            state: {},
          },
          GovContract: testAddressProvider.gov(),
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.govState?.total_deposit).toBe('string');
  });
});
