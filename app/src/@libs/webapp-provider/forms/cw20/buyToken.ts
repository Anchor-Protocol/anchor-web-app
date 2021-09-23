import { CW20Addr, HumanAddr, Rate, Token, UST } from '@libs/types';
import { useForm } from '@libs/use-form';
import {
  CW20BuyTokenForm,
  cw20BuyTokenForm,
  CW20BuyTokenFormInput,
  Tax,
  TokenBalances,
} from '@libs/webapp-fns';
import { useBank, useTerraWebapp } from '@libs/webapp-provider';
import { useConnectedWallet } from '@terra-dev/use-wallet';

export interface CW20BuyTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useCW20BuyTokenForm<T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
}: CW20BuyTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const {
    mantleFetch,
    mantleEndpoint,
    constants: { fixedGas },
  } = useTerraWebapp();

  const { tax, tokenBalances } = useBank<TokenBalances, Tax>();

  const form: CW20BuyTokenForm<T> = cw20BuyTokenForm;

  return useForm(
    form,
    {
      ustTokenPairAddr,
      tokenAddr,
      mantleEndpoint,
      mantleFetch,
      ustBalance: tokenBalances.uUST,
      tax,
      fixedGas,
      connected: !!connectedWallet,
    },
    () =>
      ({
        ustAmount: '' as UST,
        maxSpread: '0.01' as Rate,
      } as CW20BuyTokenFormInput<T>),
  );
}
