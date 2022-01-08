import { astroportDepositQuery } from '@libs/app-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_LCD_CLIENT,
  TEST_WALLET_ADDRESS,
} from '@libs/app-fns/test-env';

describe('astroportDepositQuery()', () => {
  test('should get result from query', async () => {
    const result = await astroportDepositQuery(
      TEST_WALLET_ADDRESS,
      TEST_CONTRACT_ADDRESS.cw20.AncUstLp,
      TEST_CONTRACT_ADDRESS.astroport.generator,
      TEST_LCD_CLIENT,
    );

    expect(+(result?.deposit ?? '0')).toBeGreaterThan(0);
  });
});
