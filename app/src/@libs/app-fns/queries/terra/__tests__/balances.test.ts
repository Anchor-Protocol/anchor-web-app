import { terraBalancesQuery } from '@libs/app-fns';
import { TEST_HIVE_CLIENT, TEST_WALLET_ADDRESS } from '@libs/app-fns/test-env';
import { terraswap } from '@libs/types';

const assetInfos: terraswap.AssetInfo[] = [
  {
    native_token: {
      denom: 'uluna',
    },
  },
  {
    token: {
      contract_addr: 'terra15tecrcm27fenchxaqde9f8ws8krfgjnqf2hhcv',
    },
  },
  {
    token: {
      contract_addr: 'terra1gkjll5uwqlwa8mrmtvzv435732tffpjql494fd',
    },
  },
] as any;

describe('terraBalancesQuery()', () => {
  test('should get result', async () => {
    const result = await terraBalancesQuery(
      TEST_WALLET_ADDRESS,
      assetInfos,
      TEST_HIVE_CLIENT,
    );

    expect(result.balances[0].asset).toEqual({
      native_token: { denom: 'uluna' },
    });
    expect(result.balances[1].asset).toEqual({
      token: {
        contract_addr: 'terra15tecrcm27fenchxaqde9f8ws8krfgjnqf2hhcv',
      },
    });
    expect(result.balances[2].asset).toEqual({
      token: {
        contract_addr: 'terra1gkjll5uwqlwa8mrmtvzv435732tffpjql494fd',
      },
    });
    expect(+result.balances[0].balance).not.toBeNaN();
    expect(+result.balances[1].balance).not.toBeNaN();
    expect(+result.balances[2].balance).not.toBeNaN();
    expect(result.balancesIndex.size).toBe(3);
  });
});
