import { TEST_ADDRESSES } from '@anchor-protocol/app-fns/test-env';
import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { bAssetInfoListQuery } from '../bAssetInfoList';

describe('queries/bAssetInfoList', () => {
  test('should get result from query', async () => {
    const list = await bAssetInfoListQuery(
      TEST_ADDRESSES.moneyMarket.overseer,
      TEST_LCD_CLIENT,
    );

    expect(list).toMatchSnapshot();
  });
});
