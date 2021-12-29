import { TEST_ADDRESSES } from '@anchor-protocol/app-fns/test-env';
import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { CW20Addr } from '@libs/types';
import { bAssetInfoByTokenAddrQuery } from '../bAssetInfoByTokenAddr';

describe('bAssetInfoByTokenAddrQuery', () => {
  test('should get result from query', async () => {
    const info = await bAssetInfoByTokenAddrQuery(
      TEST_ADDRESSES.moneyMarket.overseer,
      'terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l' as CW20Addr,
      TEST_LCD_CLIENT,
    );

    expect(info).toMatchSnapshot();
  });
});
