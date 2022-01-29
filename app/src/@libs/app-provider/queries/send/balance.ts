import { EMPTY_NATIVE_BALANCES, pickNativeBalance } from '@libs/app-fns';
import { CW20Addr, HumanAddr, NativeDenom, Token, u } from '@libs/types';
import { useMemo } from 'react';
import { useAccount } from 'contexts/account';
import { useCW20BalanceQuery } from '../cw20/balance';
import { useTerraNativeBalancesQuery } from '../terra/nativeBalances';

export function useSendBalanceQuery<T extends Token>(
  token: NativeDenom | CW20Addr,
  walletAddr?: HumanAddr | undefined,
): u<T> {
  const { connected, terraWalletAddress } = useAccount();

  const { data: nativeBalances = EMPTY_NATIVE_BALANCES } =
    useTerraNativeBalancesQuery(walletAddr ?? terraWalletAddress);

  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<Token>(
    token.length > 10 ? (token as CW20Addr) : undefined,
    terraWalletAddress,
  );

  return useMemo<u<T>>(() => {
    if (!connected) {
      return '0' as u<T>;
    } else if (token.length > 10) {
      return (tokenBalance?.balance ?? '0') as u<T>;
    }

    return pickNativeBalance<T>(token as NativeDenom, nativeBalances);
  }, [connected, nativeBalances, token, tokenBalance?.balance]);
}
