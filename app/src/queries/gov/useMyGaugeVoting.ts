import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider';
import { useAccount } from 'contexts/account';
import { useQuery } from 'react-query';
import { u } from '@libs/types';
import Big, { BigSource } from 'big.js';
import { veANC } from '@anchor-protocol/types';

interface GaugeVote {
  amount: u<veANC<BigSource>>;
  lockPeriodEndsAt: number;
}

type AccountGaugesVotes = Record<string, GaugeVote>;

export const useMyGaugeVoting = () => {
  const { terraWalletAddress } = useAccount();

  return useQuery(
    [ANCHOR_QUERY_KEY.ACCOUNT_GAUGES_VOTES, terraWalletAddress],
    () => {
      const now = Date.now();
      const accountGaugesVotes: AccountGaugesVotes = {
        terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp: {
          amount: Big('6789069442123') as u<veANC<BigSource>>,
          lockPeriodEndsAt: now - 100000,
        },
        terra1z3e2e4jpk4n0xzzwlkgcfvc95pc5ldq0xcny58: {
          amount: Big('1789069442123') as u<veANC<BigSource>>,
          lockPeriodEndsAt: now + 100000,
        },
      };

      // TODO: request votes for a current account
      return accountGaugesVotes;
    },
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      enabled: !!terraWalletAddress,
    },
  );
};
