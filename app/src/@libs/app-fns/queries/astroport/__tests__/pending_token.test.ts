import { astroportPendingTokenQuery } from '@libs/app-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_LCD_CLIENT,
  TEST_WALLET_ADDRESS,
} from '@libs/app-fns/test-env';

describe('astroportPendingTokenQuery()', () => {
  test('should get result from query', async () => {
    const result = await astroportPendingTokenQuery(
      TEST_WALLET_ADDRESS,
      TEST_CONTRACT_ADDRESS.cw20.AncUstLp,
      TEST_CONTRACT_ADDRESS.astroport.generator,
      TEST_LCD_CLIENT,
    );

    expect(+(result?.pendingToken.pending ?? '0')).toBeGreaterThanOrEqual(0);
    expect(
      +(result?.pendingToken.pending_on_proxy ?? '0'),
    ).toBeGreaterThanOrEqual(0);
  });
});
