import { map } from '@anchor-protocol/use-map';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../rewardsUSTBorrow';
import { testAddressProvider, testClient, testWalletAddress } from 'test.env';

describe('queries/rewardsUSTBorrow', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          MarketContract: testAddressProvider.market(''),
          userWalletAddress: testWalletAddress,
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.marketState?.total_liabilities).toBe('string');
    //expect(typeof data.userANCBalance?.balance).toBe('string');
    //console.log('rewardsUSTBorrow.test.ts..()', data);
  });
});
