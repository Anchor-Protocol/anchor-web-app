import { JSDateTime } from '@anchor-protocol/types';
import { TEST_MANTLE_ENDPOINT } from '@anchor-protocol/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-money/webapp-fns';
import { earnAPYHistoryQuery } from '../apyHistory';

describe('queries/apyHistory', () => {
  test('should get result from query', async () => {
    const { apyHistory } = await earnAPYHistoryQuery({
      mantleFetch: defaultMantleFetch,
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      variables: {
        timestampMax: (Date.now() - 1000 * 60 * 30) as JSDateTime,
      },
    });

    expect(Array.isArray(apyHistory)).toBeTruthy();
  });
});
