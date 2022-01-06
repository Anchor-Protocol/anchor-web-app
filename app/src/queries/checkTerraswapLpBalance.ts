import { rewardsAncUstLpRewardsQuery } from '@anchor-protocol/app-fns';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { AncUstLP } from '@anchor-protocol/types';
import { CW20Addr, HumanAddr, u } from '@libs/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useEffect, useState } from 'react';

const address = {
  'columnbus-5': {
    terraswapAncUstPair:
      'terra1gm5p3ner9x9xpwugn9sp6gvhd0lwrtkyrecdn3' as HumanAddr,
    terraswapAncUstLPToken:
      'terra1gecs98vcuktyfkrve9czrpgtg0m3aq586x6gzm' as CW20Addr,
    staking: 'terra1897an2xux840p9lrh6py3ryankc6mspw49xse3' as HumanAddr,
  },
  'bombay-12': {
    terraswapAncUstPair:
      'terra1wfvczps2865j0awnurk9m04u7wdmd6qv3fdnvz' as HumanAddr,
    terraswapAncUstLPToken:
      'terra1vg0qyq92ky9z9dp0j9fv5rmr2s80sg605dah6f' as CW20Addr,
    staking: 'terra19nxz35c8f7t3ghdxrxherym20tux8eccar0c3k' as HumanAddr,
  },
} as const;

export function useCheckTerraswapLpBalance() {
  const connectedWallet = useConnectedWallet();

  const { queryClient } = useAnchorWebapp();

  const [balances, setBalances] = useState<{
    lpBalance: u<AncUstLP>;
    lpStaked: u<AncUstLP>;
  } | null>(null);

  useEffect(() => {
    if (!connectedWallet) {
      return;
    }

    const { terraswapAncUstLPToken, staking } =
      address[
        connectedWallet.network.chainID === 'columnbus-5'
          ? 'columnbus-5'
          : 'bombay-12'
      ];

    rewardsAncUstLpRewardsQuery(
      connectedWallet.walletAddress,
      staking,
      terraswapAncUstLPToken,
      queryClient,
    ).then((result) => {
      if (!result) {
        setBalances(null);
      } else if (
        big(result.userLPBalance.balance).lte(0.01) &&
        big(result.userLPStakingInfo.bond_amount).lte(0.01)
      ) {
        setBalances(null);
      } else {
        setBalances({
          lpBalance: result.userLPBalance.balance,
          lpStaked: result.userLPStakingInfo.bond_amount,
        });
      }
    });
  }, [connectedWallet, queryClient]);

  return balances;
}
