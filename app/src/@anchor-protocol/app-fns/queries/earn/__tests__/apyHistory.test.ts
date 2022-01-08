import { earnAPYHistoryQuery } from '../apyHistory';

describe('queries/apyHistory', () => {
  test('should get result from query', async () => {
    const { apyHistory } = await earnAPYHistoryQuery(
      'https://api-testnet.anchorprotocol.com/api',
    );
    expect(Array.isArray(apyHistory)).toBeTruthy();
  });
});
