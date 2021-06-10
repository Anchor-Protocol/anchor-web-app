const sheet = `
Deposit stable\t0.15\t289,998\t347997.6\t52199.64\t0.05219964\t\tearnDeposit
Redeem stable\t0.15\t364,359\t437230.8\t65584.62\t0.06558462\t\tearnWithdraw
Borrow stable\t0.15\t375,922\t451106.4\t67665.96\t0.06766596\t\tborrowBorrow
Repay stable\t0.15\t253,160\t303792\t45568.8\t0.0455688\t\tborrowRepay
Deposit collateral/Lock collateral\t0.15\t465,009\t558010.8\t83701.62\t0.08370162\t\tborrowProvideCollateral
Unlockcollateral / WithdrawCollateral\t0.15\t630,070\t756084\t113412.6\t0.1134126\t\tborrowRedeemCollateral
bond\t0.15\t460,554\t552664.8\t82899.72\t0.08289972\t\tbondMint
burn\t0.15\t611409\t564261.6\t84639.24\t0.08463924\t\tbondBurn
instant burn\t0.15\t363,314\t435976.8\t65396.52\t0.06539652\t\tbondSwap
Withdraw unbonded\t0.15\t145,503\t174603.6\t26190.54\t0.02619054\t\tbondWithdraw
Claim Rewards\t0.15\t154,175\t185010\t27751.5\t0.0277515\t\tbondClaim
ANC buy\t0.15\t182,327\t218792.4\t32818.86\t0.03281886\t\tancBuy
ANC sell\t0.15\t203,393\t244071.6\t36610.74\t0.03661074\t\tancSell
gov Stake\t0.15\t175,688\t210825.6\t31623.84\t0.03162384\t\tancGovernanceStake
gov Unstake\t0.15\t174,643\t209571.6\t31435.74\t0.03143574\t\tancGovernanceUnstake
provide liquidity\t0.15\t302,075\t362490\t54373.5\t0.0543735\t\tancAncUstLpProvide
withdraw liquidity\t0.15\t312,178\t374613.6\t56192.04\t0.05619204\t\tancAncUstLpWithdraw
Lp staking\t0.15\t170,962\t205154.4\t30773.16\t0.03077316\t\tancAncUstLpStake
Lp unstaking\t0.15\t168,896\t202675.2\t30401.28\t0.03040128\t\tancAncUstLpUnstake
claim all rewards\t0.15\t450,752\t540902.4\t81135.36\t0.08113536\t\trewardsAllClaim
CreatePoll\t0.15\t191,143\t229371.6\t34405.74\t0.03440574\t\tgovCreatePoll
Vote\t0.15\t138,296\t165955.2\t24893.28\t0.02489328\t\tgovVote
`
  .trim()
  .split('\n')
  .map((line) => line.split('\t'))
  .map(
    ([description, gasPrice, gasUsed, gasFee, fixedGas, gasInUst, , tx]) => ({
      description,
      gasFee: Math.ceil(+gasUsed.replace(/,/g, '') * 1.4),
      fixedGas: Math.ceil(+gasUsed.replace(/,/g, '') * 1.4 * 0.15),
      tx,
    }),
  )
  .reduce((record, { tx, description, gasFee, fixedGas }) => {
    record[tx] = { description, gasFee, fixedGas };
    return record;
  }, {} as Record<string, { gasFee: number; fixedGas: number; description: string }>);

const values = Object.keys(sheet)
  .map((tx) => {
    const { description, fixedGas, gasFee } = sheet[tx];
    return `${tx}: {description: '${description}', gasFee: ${gasFee} as uUST<number>, fixedGas: ${fixedGas} as uUST<number>},`;
  })
  .concat([
    `rewardsAncUstLpClaim: {description: '${sheet['rewardsAllClaim'].description}', gasFee: ${sheet['rewardsAllClaim'].gasFee} as uUST<number>, fixedGas: ${sheet['rewardsAllClaim'].fixedGas} as uUST<number>},`,
    `rewardsUstBorrowClaim: {description: '${sheet['rewardsAllClaim'].description}', gasFee: ${sheet['rewardsAllClaim'].gasFee} as uUST<number>, fixedGas: ${sheet['rewardsAllClaim'].fixedGas} as uUST<number>},`,
  ]);

const types = Object.keys(sheet)
  .map((tx) => {
    return `${tx}: Gas,`;
  })
  .concat([`rewardsAncUstLpClaim: Gas,`, `rewardsUstBorrowClaim: Gas,`]);

console.log(`{\n${types.join('\n')}\n}`);
console.log(`{\n${values.join('\n')}\n}`);

export const foo = 10;
