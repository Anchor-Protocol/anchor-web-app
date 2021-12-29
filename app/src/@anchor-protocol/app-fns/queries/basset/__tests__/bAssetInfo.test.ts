import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { CW20Addr, HumanAddr, Rate } from '@libs/types';
import { bAssetInfoQuery } from '../bAssetInfo';

describe('bAssetInfoQuery', () => {
  test('should get result from query', async () => {
    const result = await bAssetInfoQuery(
      {
        name: 'Bonded ETH',
        symbol: 'BETH',
        max_ltv: '0.6' as Rate,
        custody_contract:
          'terra1j6fey5tl70k9fvrv7mea7ahfr8u2yv7l23w5e6' as HumanAddr,
        collateral_token:
          'terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l' as CW20Addr,
      },
      TEST_LCD_CLIENT,
    );

    expect(result).toMatchSnapshot();
  });
});
