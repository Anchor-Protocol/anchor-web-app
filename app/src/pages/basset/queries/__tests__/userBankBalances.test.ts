import { mantleClient } from '../../../../env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../userBankBalances';

describe('queries/exchangeRate', () => {
  test('should get result from query', async () => {
    const data = await mantleClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          userAddress: 'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
        }),
      })
      .then(({ data }) => parseData(data));

    expect(typeof data.has('uluna')).toBeTruthy();
  });
});
