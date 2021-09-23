import { CW20Addr, HumanAddr, Token, u } from '@libs/types';
import { useForm } from '@libs/use-form';
import {
  CW20SellTokenForm,
  cw20SellTokenForm,
  CW20SellTokenFormInput,
  Tax,
  TokenBalances,
} from '@libs/webapp-fns';
import { useBank, useTerraWebapp } from '@libs/webapp-provider';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useCW20BalanceQuery } from '../../queries/cw20/balance';

export interface CW20SellTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useCW20SellTokenForm<T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
}: CW20SellTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const {
    mantleFetch,
    mantleEndpoint,
    constants: { fixedGas },
  } = useTerraWebapp();

  const { tax, tokenBalances } = useBank<TokenBalances, Tax>();

  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<T>(
    tokenAddr,
    connectedWallet?.terraAddress,
  );

  const form: CW20SellTokenForm<T> = cw20SellTokenForm;

  return useForm(
    form,
    {
      ustTokenPairAddr,
      tokenAddr,
      mantleEndpoint,
      mantleFetch,
      ustBalance: tokenBalances.uUST,
      tokenBalance: tokenBalance?.balance ?? ('0' as u<T>),
      tax,
      fixedGas,
      connected: !!connectedWallet,
    },
    () =>
      ({
        tokenAmount: '' as T,
        maxSpread: '0.01',
      } as CW20SellTokenFormInput<T>),
  );
}
