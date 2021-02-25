import { map } from '@anchor-protocol/use-map';
import { testClient } from 'test.env';
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
        variables: mapVariables({}),
      })
      .then(({ data }) => map(data, dataMap));

    expect(Array.isArray(data.apyHistory)).toBeTruthy();
  });
});
