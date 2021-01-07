import { testClient, testAddressProvider } from 'env.test';
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
            address: 'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
          },
        },
        moneyMarketContract: testAddressProvider.market(''),
        moneyMarketEpochQuery: {
          epoch_state: {},
        },
      }),
    });
    //  .then(({ data }) => parseData(data));
    //
    //expect(!!data.rewardState).toBeTruthy();
    console.log('totalDeposit.test.ts..()', data);
  });
});
