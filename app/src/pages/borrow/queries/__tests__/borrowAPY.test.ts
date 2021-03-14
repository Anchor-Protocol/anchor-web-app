import { testClient } from 'base/test.env';
import { query, RawData } from '../borrowAPY';

describe('queries/borrowAPY', () => {
  test('should get result from query', async () => {
    const data = await testClient.query<RawData, {}>({
      query,
    });

    expect(Array.isArray(data.data.borrowerDistributionAPYs)).toBeTruthy();
    expect(Array.isArray(data.data.govRewards)).toBeTruthy();
    expect(Array.isArray(data.data.lpRewards)).toBeTruthy();
  });
});
