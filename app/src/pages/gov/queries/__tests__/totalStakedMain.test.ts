import { map } from '@terra-dev/use-map';
import {
  testAddress,
  testClient,
} from '@anchor-protocol/web-contexts/test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../totalStakedMain';

describe('queries/totalStakedMain', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          address: testAddress,
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(typeof data.govState?.total_deposit).toBe('string');
  });
});
