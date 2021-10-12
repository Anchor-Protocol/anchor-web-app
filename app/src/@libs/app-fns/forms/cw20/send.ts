import { min } from '@libs/big-math';
import { microfy } from '@libs/formatter';
import { Rate, Token, u, UST } from '@libs/types';
import { FormFunction, FormReturn } from '@libs/use-form';
import { AccAddress } from '@terra-money/terra.js';
import big, { BigSource } from 'big.js';
import { computeMaxUstBalanceForUstTransfer } from '../../logics/computeMaxUstBalanceForUstTransfer';
import { SendTokenInfo } from './tokens';

export interface SendFormInput<T extends Token> {
  amount: T;
  toAddr: string;
  memo: string;
}

export interface SendFormDependency<T extends Token> {
  //
  balance: u<T>;
  ustBalance: u<UST>;
  //
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
  fixedFee: u<UST<BigSource>>;
  //
  tokenInfo: SendTokenInfo;
  connected: boolean;
}

export interface SendFormStates<T extends Token> extends SendFormInput<T> {
  maxAmount: u<T>;
  txFee: u<UST<BigSource>> | null;

  invalidToAddr: string | null;
  invalidTxFee: string | null;
  invalidAmount: string | null;
  invalidMemo: string | null;
  warningNextTxFee: string | null;
  warningEmptyMemo: string | null;

  availableTx: boolean;
}

export interface SendFormAsyncStates {}

export type SendForm<T extends Token> = FormFunction<
  SendFormInput<T>,
  SendFormDependency<T>,
  SendFormStates<T>,
  SendFormAsyncStates
>;

export const sendForm = <T extends Token>({
  balance,
  ustBalance,
  tokenInfo,
  taxRate,
  maxTaxUUSD,
  fixedFee,
  connected,
}: SendFormDependency<T>) => {
  const isUst =
    'native_token' in tokenInfo.assetInfo &&
    tokenInfo.assetInfo.native_token.denom === 'uusd';

  const maxAmount: u<T> = isUst
    ? (computeMaxUstBalanceForUstTransfer(
        balance as u<UST>,
        taxRate,
        maxTaxUUSD,
        fixedFee,
      ).toFixed() as u<T>)
    : balance;

  return ({
    toAddr,
    amount,
    memo,
  }: SendFormInput<T>): FormReturn<SendFormStates<T>, SendFormAsyncStates> => {
    const amountExists: boolean = amount.length > 0 && big(amount).gt(0);

    const invalidToAddr =
      toAddr.length > 0 && !AccAddress.validate(toAddr)
        ? 'Invalid address'
        : null;

    const invalidMemo =
      memo.length > 0 && /[<>]/.test(memo)
        ? 'Characters < and > are not allowed'
        : null;

    if (!amountExists) {
      return [
        {
          amount,
          toAddr,
          memo,
          maxAmount,
          txFee: null,
          invalidToAddr,
          invalidMemo,
          invalidAmount: null,
          invalidTxFee: null,
          warningNextTxFee: null,
          warningEmptyMemo: null,
          availableTx: false,
        },
        undefined,
      ];
    }

    const txFee = (
      isUst
        ? min(microfy(amount!).mul(taxRate), maxTaxUUSD).plus(fixedFee)
        : fixedFee
    ) as u<UST<BigSource>>;

    const invalidTxFee =
      connected && big(txFee).gt(ustBalance)
        ? 'Not enough transaction fees'
        : null;

    const invalidAmount = !connected
      ? null
      : isUst
      ? microfy(amount!).plus(txFee).gt(balance)
        ? 'Not enough UST'
        : null
      : microfy(amount!).gt(balance)
      ? 'Not enough assets'
      : null;

    const availableTx =
      connected &&
      amount.length > 0 &&
      toAddr.length > 0 &&
      !invalidTxFee &&
      !invalidToAddr &&
      !invalidMemo &&
      !invalidAmount;

    const warningNextTxFee =
      connected &&
      availableTx &&
      isUst &&
      big(balance).minus(microfy(amount!)).minus(txFee).lt(fixedFee)
        ? 'You may run out of USD balance needed for future transactions'
        : null;

    const warningEmptyMemo =
      connected && availableTx && memo.trim().length === 0
        ? 'Please double check if the transaction requires a memo'
        : null;

    return [
      {
        amount,
        toAddr,
        memo,
        maxAmount,
        txFee,
        invalidToAddr,
        invalidMemo,
        invalidTxFee,
        invalidAmount,
        warningNextTxFee,
        warningEmptyMemo,
        availableTx,
      },
      undefined,
    ];
  };
};
