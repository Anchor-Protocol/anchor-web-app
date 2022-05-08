import { AncBalance } from '@anchor-protocol/app-fns';
import { UseQueryResult } from 'react-query';
import { useAccount } from 'contexts/account';
import { useAncBalanceQuery } from '@anchor-protocol/app-provider';

export function useMyAncBalanceQuery(): UseQueryResult<AncBalance | undefined> {
  const { terraWalletAddress } = useAccount();

  return useAncBalanceQuery(terraWalletAddress);
}
