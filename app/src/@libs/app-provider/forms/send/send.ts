import {
  sendForm,
  SendForm,
  SendFormInput,
  SendTokenInfo,
} from '@libs/app-fns';
import { Token } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useApp } from '../../contexts/app';
import { useFixedFee } from '../../hooks/useFixedFee';
import { useSendBalanceQuery } from '../../queries/send/balance';
import { useUstBalance } from '../../queries/terra/nativeBalances';
import { useUstTax } from '../../queries/terra/tax';

export interface SendFormParams {
  tokenInfo: SendTokenInfo;
}

export function useSendForm<T extends Token>({ tokenInfo }: SendFormParams) {
  const connectedWallet = useConnectedWallet();

  const { queryClient } = useApp();

  const fixedFee = useFixedFee();

  const { taxRate, maxTax } = useUstTax();

  const uUST = useUstBalance(connectedWallet?.walletAddress);

  const balance = useSendBalanceQuery<T>(
    'native_token' in tokenInfo.assetInfo
      ? tokenInfo.assetInfo.native_token.denom
      : tokenInfo.assetInfo.token.contract_addr,
  );

  const form: SendForm<T> = sendForm;

  return useForm(
    form,
    {
      tokenInfo,
      balance,
      walletAddr: connectedWallet?.walletAddress,
      queryClient,
      ustBalance: uUST,
      taxRate,
      maxTaxUUSD: maxTax,
      fixedFee,
      maxSpread: 0.1,
      connected: !!connectedWallet,
    },
    () => ({ amount: '', toAddr: '', memo: '' } as SendFormInput<T>),
  );
}
