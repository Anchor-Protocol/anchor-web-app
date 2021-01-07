import { mantleClient } from '../../../../env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../withdrawHistory';

describe('queries/validators', () => {
  test('should get result from query', async () => {
    const data = await mantleClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bLunaHubContract: 'terra10v2xm8wg8462sp8pukc5thc8udxtz6g0f9pym5',
          allHistory: {
            all_history: {
              start_from: 1,
              limit: 100,
            },
          },
          parameters: {
            parameters: {},
          },
        }),
      })
      .then(({ data }) => parseData(data));

    expect(Array.isArray(data.allHistory.history)).toBeTruthy();
  });
});
