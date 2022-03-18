import { TEST_ADDRESSES } from '@anchor-protocol/app-fns/test-env';
import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { AccAddress } from '@terra-money/terra.js';
import { cw20MinterQuery } from '../minter';

describe('cw20MinterQuery', () => {
  test('should get result from query', async () => {
    const { minter } = await cw20MinterQuery(
      TEST_ADDRESSES.cw20.bEth,
      TEST_LCD_CLIENT,
    );

    expect(AccAddress.validate(minter.minter)).toBeTruthy();
  });
});
