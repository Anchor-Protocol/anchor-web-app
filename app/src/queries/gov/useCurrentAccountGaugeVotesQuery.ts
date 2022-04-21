import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider';
import { useAccount } from 'contexts/account';
import { useQuery } from 'react-query';
import { Token, u } from '@libs/types';
import Big, { BigSource } from 'big.js';

type AccountGaugesVotes = Record<string, u<Token<BigSource>>>;

const accountGaugesVotes: AccountGaugesVotes = {
  bLuna: Big('6789069442123') as u<Token<BigSource>>,
  wasAVAX: Big('1789069442123') as u<Token<BigSource>>,
};

export const useCurrentAccountGaugesVotesQuery = () => {
  const { terraWalletAddress } = useAccount();

  return useQuery(
    [ANCHOR_QUERY_KEY.ACCOUNT_GAUGES_VOTES, terraWalletAddress],
    () => {
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
