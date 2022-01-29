import {
  CW20BuyTokenForm,
  cw20BuyTokenForm,
  CW20BuyTokenFormInput,
} from '@libs/app-fns';
import { CW20Addr, HumanAddr, Rate, Token, UST } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';
import { useApp } from '../../contexts/app';
import { useFixedFee } from '../../hooks/useFixedFee';
import { useUstBalance } from '../../queries/terra/nativeBalances';
import { useUstTax } from '../../queries/terra/tax';

export interface CW20BuyTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useCW20BuyTokenForm<T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
}: CW20BuyTokenFormParams) {
  const { connected, terraWalletAddress } = useAccount();

  const { queryClient } = useApp();

  const fixedFee = useFixedFee();

  const { taxRate, maxTax } = useUstTax();

  const uUST = useUstBalance(terraWalletAddress);

  const form: CW20BuyTokenForm<T> = cw20BuyTokenForm;

  return useForm(
    form,
    {
      ustTokenPairAddr,
      tokenAddr,
      queryClient,
      ustBalance: uUST,
      taxRate,
      maxTaxUUSD: maxTax,
      fixedFee,
      connected,
    },
    () =>
      ({
        ustAmount: '' as UST,
        maxSpread: '0.01' as Rate,
      } as CW20BuyTokenFormInput<T>),
  );
}
