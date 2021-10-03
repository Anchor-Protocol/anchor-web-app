import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { TEST_ADDRESSES } from '../../../test-env';
import { bondBLunaExchangeRateQuery } from '../bLunaExchangeRate';

describe('queries/bLunaExchangeRate', () => {
  test('should get result from query', async () => {
    const { state, parameters } = await bondBLunaExchangeRateQuery(
      TEST_ADDRESSES.bluna.hub,
      TEST_LCD_CLIENT,
    );

    expect(+state.exchange_rate).not.toBeNaN();
    expect(state).not.toBeUndefined();
    expect(parameters).not.toBeUndefined();
  });
});
