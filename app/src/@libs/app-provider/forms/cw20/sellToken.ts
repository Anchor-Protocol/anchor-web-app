import {
  CW20SellTokenForm,
  cw20SellTokenForm,
  CW20SellTokenFormInput,
} from '@libs/app-fns';
import { CW20Addr, HumanAddr, Token } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useApp } from '../../contexts/app';
import { useFixedFee } from '../../hooks/useFixedFee';
import { useCW20Balance } from '../../queries/cw20/balance';
import { useUstBalance } from '../../queries/terra/nativeBalances';
import { useUstTax } from '../../queries/terra/tax';

export interface CW20SellTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useCW20SellTokenForm<T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
}: CW20SellTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const { queryClient } = useApp();

  const fixedFee = useFixedFee();

  const { taxRate, maxTax } = useUstTax();

  const uUST = useUstBalance(connectedWallet?.walletAddress);

  const uToken = useCW20Balance<T>(tokenAddr, connectedWallet?.terraAddress);

  const form: CW20SellTokenForm<T> = cw20SellTokenForm;

  return useForm(
    form,
    {
      ustTokenPairAddr,
      tokenAddr,
      queryClient,
      ustBalance: uUST,
      tokenBalance: uToken,
      taxRate,
      maxTaxUUSD: maxTax,
      fixedFee,
      connected: !!connectedWallet,
    },
    () =>
      ({
        tokenAmount: '' as T,
        maxSpread: '0.01',
      } as CW20SellTokenFormInput<T>),
  );
}
