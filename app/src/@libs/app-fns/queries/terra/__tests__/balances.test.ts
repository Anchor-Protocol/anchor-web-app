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
      // bLuna
      contract_addr: 'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x',
    },
  },
  {
    token: {
      // ANC
      contract_addr: 'terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc',
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
        contract_addr: 'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x',
      },
    });
    expect(result.balances[2].asset).toEqual({
      token: {
        contract_addr: 'terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc',
      },
    });
    expect(+result.balances[0].balance).not.toBeNaN();
    expect(+result.balances[1].balance).not.toBeNaN();
    expect(+result.balances[2].balance).not.toBeNaN();
    expect(result.balancesIndex.size).toBe(3);
  });
});
