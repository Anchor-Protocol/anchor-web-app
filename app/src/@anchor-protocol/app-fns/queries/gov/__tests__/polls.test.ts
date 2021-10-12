import { TEST_ADDRESSES } from '@anchor-protocol/app-fns/test-env';
import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { govPollsQuery } from '../polls';

describe('queries/polls', () => {
  test('should get result from query', async () => {
    const { polls } = await govPollsQuery(
      TEST_ADDRESSES.anchorToken.gov,
      {
        limit: 6,
      },
      TEST_LCD_CLIENT,
    );

    expect(Array.isArray(polls?.polls)).toBeTruthy();
  });
});
