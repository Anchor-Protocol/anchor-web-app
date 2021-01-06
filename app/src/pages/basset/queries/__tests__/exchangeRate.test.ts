import { mantleClient } from '../../../../env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../exchangeRate';

describe('queries/exchangeRate', () => {
  test('should get result from query', async () => {
    const data = await mantleClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bLunaHubContract: 'terra10v2xm8wg8462sp8pukc5thc8udxtz6g0f9pym5',
        }),
      })
      .then(({ data }) => parseData(data));

    expect(typeof data.exchangeRate.Result.actual_unbonded_amount).toBe(
      'string',
    );
  });
});
