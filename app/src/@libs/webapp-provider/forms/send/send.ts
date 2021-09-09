import { Token } from '@libs/types';
import { useForm } from '@libs/use-form';
import {
  sendForm,
  SendForm,
  SendFormInput,
  SendTokenInfo,
  Tax,
  TokenBalances,
} from '@libs/webapp-fns';
import { useBank, useTerraWebapp } from '@libs/webapp-provider';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useSendBalanceQuery } from '../../queries/send/balance';

export interface SendFormParams {
  tokenInfo: SendTokenInfo;
}

export function useSendForm<T extends Token>({ tokenInfo }: SendFormParams) {
  const connectedWallet = useConnectedWallet();

  const {
    mantleFetch,
    mantleEndpoint,
    constants: { fixedGas },
  } = useTerraWebapp();

  const balance = useSendBalanceQuery<T>(
    'native_token' in tokenInfo.assetInfo
      ? tokenInfo.assetInfo.native_token.denom
      : tokenInfo.assetInfo.token.contract_addr,
  );

  const { tax, tokenBalances } = useBank<TokenBalances, Tax>();

  const form: SendForm<T> = sendForm;

  return useForm(
    form,
    {
      tokenInfo,
      balance,
      walletAddr: connectedWallet?.walletAddress,
      mantleEndpoint,
      mantleFetch,
      ustBalance: tokenBalances.uUST,
      tax,
      fixedGas,
      maxSpread: 0.1,
      connected: !!connectedWallet,
    },
    () => ({ amount: '', toAddr: '', memo: '' } as SendFormInput<T>),
  );
}
