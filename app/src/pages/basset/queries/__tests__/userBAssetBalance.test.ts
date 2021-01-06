import { mantleClient } from '../../../../env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../userBAssetBalance';

describe('queries/userBAssetBalance', () => {
  test('should get result from query', async () => {
    const data = await mantleClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bAssetTokenContract: 'terra1gqu4yv2y8rkgnywmz8zckp3jv7pxpsaeck4wsh',
          bAssetBalanceQuery: {
            balance: {
              address: 'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
            },
          },
        }),
      })
      .then(({ data }) => parseData(data));

    expect(parseInt(data.bAssetBalance.balance)).not.toBeNaN();
  });
});
