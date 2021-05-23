import { JSDateTime } from '@anchor-protocol/types';
import { defaultMantleFetch } from '@terra-money/webapp-fns';
import { TEST_MANTLE_ENDPOINT } from '../../test-env';
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
