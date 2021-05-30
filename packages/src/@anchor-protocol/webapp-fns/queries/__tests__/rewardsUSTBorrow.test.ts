import { map } from '@terra-dev/use-map';
import { testAddress, testClient, testWalletAddress } from 'base/test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../rewardsUSTBorrow';

describe('queries/rewardsUSTBorrow', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          MarketContract: testAddress.moneyMarket.market,
          MarketStateQuery: {
            state: {},
          },
          BorrowerInfoQuery: {
            borrower_info: {
              borrower: testWalletAddress,
            },
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.marketState?.total_liabilities).toBe('string');
    //expect(typeof data.userANCBalance?.balance).toBe('string');
    //console.log('rewardsUSTBorrow.test.ts..()', data);
  });
});
