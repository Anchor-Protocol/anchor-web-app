import { mantleClient } from '../../../../env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../withdrawable';

describe('queries/claim', () => {
  test('should get result from query', async () => {
    const data = await mantleClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bLunaHubContract: 'terra10v2xm8wg8462sp8pukc5thc8udxtz6g0f9pym5',
          withdrawableAmountQuery: {
            withdrawable_unbonded: {
              address: 'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
              block_time: new Date().getTime() - 1000 * 60 * 60 * 24 * 10,
            },
          },
          withdrawRequestsQuery: {
            unbond_requests: {
              address: 'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
            },
          },
          exchangeRateQuery: {
            state: {},
          },
        }),
      })
      .then(({ data }) => parseData(data));

    expect(Array.isArray(data.withdrawRequests.requests)).toBeTruthy();
  });
});
