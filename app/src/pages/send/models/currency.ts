import { CW20Addr, Token, uToken, uUST } from '@anchor-protocol/types';
import { Bank } from 'contexts/bank';
import { BigSource } from 'big.js';

export interface CurrencyInfo {
  label: string;
  value: string;
  integerPoints: number;
  decimalPoints: number;
  getWithdrawable: (bank: Bank, fixedGas: uUST<BigSource>) => uToken;
  getFormatWithdrawable: (bank: Bank, fixedGas: uUST<BigSource>) => Token;
  cw20Address?: CW20Addr;
}
