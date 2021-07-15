import { CW20Addr } from '@anchor-protocol/types';
import { BAssetLtv } from '../../../queries/borrow/market';
import { computeRedeemCollateralWithdrawableAmount } from '../computeRedeemCollateralWithdrawableAmount';

function formula(
  bLunaPrice: number,
  bEthPrice: number,
  bLunaLockedAmount: number,
  bEthLockedAmount: number,
  safeLtv: number,
  maxLtv: number,
  loanAmount: number,
) {
  return {
    bLunaWithdrawable:
      bLunaLockedAmount +
      (bEthLockedAmount * bEthPrice * maxLtv - loanAmount / safeLtv) /
        (maxLtv * bLunaPrice),
    bEthWithdrawable:
      bEthLockedAmount +
      (bLunaLockedAmount * bLunaPrice * maxLtv - loanAmount / safeLtv) /
        (maxLtv * bEthPrice),
  };
}

test('computeRedeemCollateralWithdrawableAmount()', () => {
  const { marketBorrowerInfo, overseerCollaterals, oraclePrices } = {
    marketBorrowerInfo: {
      borrower: 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9',
      interest_index: '1.059697678315740162',
      loan_amount: '0',
      pending_rewards: '30516683864.33001176611976189',
      reward_index: '705.381084001794613749',
    },
    overseerCollaterals: {
      borrower: 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9',
      collaterals: [
        ['terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l', '500000'],
        ['terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x', '27827271'],
      ],
    },
    oraclePrices: {
      prices: [
        {
          asset: 'terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l',
          last_updated_time: 1626324557,
          price: '1969.02528415',
        },
        {
          asset: 'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x',
          last_updated_time: 1626324557,
          price: '6.864343416935091223',
        },
      ],
    },
  };

  const { bLunaWithdrawable, bEthWithdrawable } = formula(
    +oraclePrices.prices[1].price,
    +oraclePrices.prices[0].price,
    +overseerCollaterals.collaterals[1][1],
    +overseerCollaterals.collaterals[0][1],
    0.45,
    0.6,
    +marketBorrowerInfo.loan_amount,
  );

  expect(
    computeRedeemCollateralWithdrawableAmount(
      'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x' as CW20Addr,
      marketBorrowerInfo as any,
      overseerCollaterals as any,
      oraclePrices as any,
      new Map<CW20Addr, BAssetLtv>([
        [
          'terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l',
          { safe: '0.45', max: '0.6' },
        ],
        [
          'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x',
          { safe: '0.45', max: '0.6' },
        ],
      ] as any),
    )
      .toFixed()
      .split('.')[0],
  ).toBe(bLunaWithdrawable.toFixed().split('.')[0]);

  expect(
    computeRedeemCollateralWithdrawableAmount(
      'terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l' as CW20Addr,
      marketBorrowerInfo as any,
      overseerCollaterals as any,
      oraclePrices as any,
      new Map<CW20Addr, BAssetLtv>([
        [
          'terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l',
          { safe: '0.45', max: '0.6' },
        ],
        [
          'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x',
          { safe: '0.45', max: '0.6' },
        ],
      ] as any),
    )
      .toFixed()
      .split('.')[0],
  ).toBe(bEthWithdrawable.toFixed().split('.')[0]);
});
