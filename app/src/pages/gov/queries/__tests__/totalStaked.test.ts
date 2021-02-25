import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient } from 'test.env';
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
          ANCTokenContract: testAddressProvider.token(),
          ANCTokenBalanceQuery: {
            balance: {
              address: testAddressProvider.gov(),
            },
          },
          GovContract: testAddressProvider.gov(),
        }),
      })
      .then(({ data }) => map(data, dataMap));
    //
    //expect(typeof data.ancPrice?.ANCPrice).toBe('string');
    console.log('totalStaked.test.ts..()', data);
  });
});
