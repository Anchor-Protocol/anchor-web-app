import { CW20Addr, Token, u, UST } from '@anchor-protocol/types';
import { BigSource } from 'big.js';
import { Bank } from 'contexts/bank';

export interface CurrencyInfo {
  label: string;
  value: string;
  integerPoints: number;
  decimalPoints: number;
  getWithdrawable: (bank: Bank, fixedGas: u<UST<BigSource>>) => u<Token>;
  getFormatWithdrawable: (bank: Bank, fixedGas: u<UST<BigSource>>) => Token;
  cw20Address?: CW20Addr;
}
