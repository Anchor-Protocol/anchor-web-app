import { CW20Addr, Token, uToken } from '@anchor-protocol/types';
import { Bank } from '@anchor-protocol/web-contexts/contexts/bank';

export interface CurrencyInfo {
  label: string;
  value: string;
  integerPoints: number;
  decimalPoints: number;
  getWithdrawable: (bank: Bank) => uToken;
  getFormatWithdrawable: (bank: Bank) => Token;
  cw20Address?: CW20Addr;
}
