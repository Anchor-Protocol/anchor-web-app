import { testClient } from 'test.env';
import { mapData, query, RawData } from '../lastSyncedHeight';

describe('queries/lastSyncedHeight', () => {
  test('should get result from query', async () => {
    const data = await testClient
      .query<RawData>({
        query,
      })
      .then(({ data }) => mapData(data));

    expect(typeof data).toBe('number');
  });
});
