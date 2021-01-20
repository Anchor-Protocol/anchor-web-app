import { testClient } from 'test.env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
} from 'queries/txInfos';

describe('queries/txInfos', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          txHash:
            '045445EAA0D898DC4120051C5967C6A03561321CAD09E3F2AB4655D0A9457625',
        }),
      })
      .then(({ data }) => parseData(data));

    console.log('txInfos.test.ts..()', data);

    expect(data.length).toBeGreaterThan(0);
  });
});
