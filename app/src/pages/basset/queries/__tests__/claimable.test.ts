import { mantleClient } from '../../../../env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from '../claimable';

describe('queries/claim', () => {
  test('should get result from query', async () => {
    const data = await mantleClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          bAssetRewardContract: 'terra1lt9eyey0s7c6umypa0nf86jwyv267c6hyxtxaq',
          rewardState: {
            state: {},
          },
          claimableRewardQuery: {
            holder: {
              address: 'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
            },
          },
        }),
      })
      .then(({ data }) => parseData(data));

    expect(!!data.rewardState).toBeTruthy();
  });
});
