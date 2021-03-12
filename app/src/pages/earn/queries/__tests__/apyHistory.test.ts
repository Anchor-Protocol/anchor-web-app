import { JSDateTime } from '@anchor-protocol/types';
import { map } from '@terra-dev/use-map';
import { testClient } from '@anchor-protocol/web-contexts/test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../apyHistory';

describe('queries/apyHistory', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          timestampMax: (Date.now() - 1000 * 60 * 30) as JSDateTime,
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(Array.isArray(data.apyHistory)).toBeTruthy();
  });
});
