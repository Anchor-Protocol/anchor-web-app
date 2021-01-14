import { testClient } from 'test.env';
import { parseData, query, StringifiedData } from '../lastSyncedHeight';

describe('queries/lastSyncedHeight', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<StringifiedData>({
        query,
      })
      .then(({ data }) => parseData(data));

    expect(typeof data).toBe('number');
  });
});
