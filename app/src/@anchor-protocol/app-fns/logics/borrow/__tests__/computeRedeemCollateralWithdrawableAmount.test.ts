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
  console.log({
    bLunaPrice,
    bEthPrice,
    bLunaLockedAmount,
    bEthLockedAmount,
    safeLtv,
    maxLtv,
    loanAmount,
    bEthLockedUst: bEthLockedAmount * bEthPrice * safeLtv,
    remainUst: loanAmount - bEthLockedAmount * bEthPrice * safeLtv,
  });

  return {
    bLunaWithdrawable:
      bLunaLockedAmount -
      (loanAmount - bEthLockedAmount * bEthPrice * safeLtv) /
        (safeLtv * bLunaPrice),
    bEthWithdrawable:
      bEthLockedAmount -
      (loanAmount - bLunaLockedAmount * bLunaPrice * safeLtv) /
        (safeLtv * bEthPrice),
    bLunaWithdrawable2:
      bLunaLockedAmount -
      (loanAmount -
        Math.min(bEthLockedAmount * bEthPrice * safeLtv, loanAmount)) /
        bLunaPrice /
        safeLtv,
    bEthWithdrawable2:
      bEthLockedAmount -
      (loanAmount -
        Math.min(bLunaLockedAmount * bLunaPrice * safeLtv, loanAmount)) /
        bEthPrice /
        safeLtv,
  };
}

test('computeRedeemCollateralWithdrawableAmount()', () => {
  const { marketBorrowerInfo, overseerCollaterals, oraclePrices } = {
    marketBorrowerInfo: {
      borrower: 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9',
      interest_index: '1.059945450915923336',
      loan_amount: '277961291',
      pending_rewards: '30600940468.894819336387392925',
      reward_index: '705.553859536542986818',
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
          last_updated_time: 1626448419,
          price: '1907.6776153',
        },
        {
          asset: 'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x',
          last_updated_time: 1626448414,
          price: '6.534841985430208689',
        },
      ],
    },
  };

  const {
    bLunaWithdrawable,
    bEthWithdrawable,
    bLunaWithdrawable2,
    bEthWithdrawable2,
  } = formula(
    +oraclePrices.prices[1].price,
    +oraclePrices.prices[0].price,
    +overseerCollaterals.collaterals[1][1],
    +overseerCollaterals.collaterals[0][1],
    0.45,
    0.6,
    +marketBorrowerInfo.loan_amount,
  );

  const bLunaWithdrawableComputed = computeRedeemCollateralWithdrawableAmount(
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
  ).withdrawableAmount.toNumber();

  //expect(bLunaWithdrawableComputed).toBeCloseTo(+bLunaWithdrawable, 3);

  const bEthWithdrawableComputed = computeRedeemCollateralWithdrawableAmount(
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
  ).withdrawableAmount.toNumber();

  //expect(bEthWithdrawableComputed).toBeCloseTo(+bEthWithdrawable, 3);

  console.log({
    bLunaWithdrawable,
    bEthWithdrawable,
    bLunaWithdrawable2,
    bEthWithdrawable2,
    bLunaWithdrawableComputed,
    bEthWithdrawableComputed,
  });
});
