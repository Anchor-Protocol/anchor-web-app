import { min } from '@libs/big-math';
import { demicrofy, microfy } from '@libs/formatter';
import { MantleFetch } from '@libs/mantle';
import {
  CW20Addr,
  HumanAddr,
  NativeDenom,
  Rate,
  Token,
  u,
  UST,
} from '@libs/types';
import { FormFunction, FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';
import { computeMaxUstBalanceForUstTransfer } from '../../logics/computeMaxUstBalanceForUstTransfer';
import { terraswapSimulationQuery } from '../../queries/terraswap/simulation';
import { Tax } from '../../types';

export interface CW20BuyTokenFormInput<T extends Token> {
  ustAmount?: UST;
  tokenAmount?: T;
  maxSpread: Rate;
}

export interface CW20BuyTokenFormDependency {
  // terraswap simulation
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
  //
  ustBalance: u<UST>;
  tax: Tax;
  fixedGas: u<UST<BigSource>>;
  //
  connected: boolean;
}

export interface CW20BuyTokenFormStates<T extends Token>
  extends CW20BuyTokenFormInput<T> {
  maxUstAmount: u<UST<BigSource>>;
  invalidMaxSpread: string | null;
  invalidTxFee: string | null;
  invalidUstAmount: string | null;
  warningNextTxFee: string | null;
  availableTx: boolean;
}

export type CW20BuyTokenFormAsyncStates<T extends Token> = (
  | { ustAmount: UST }
  | { tokenAmount: T }
) & {
  beliefPrice: UST;
  txFee: u<UST>;
  minimumReceived: u<T>;
  tradingFee: u<T>;
};

export type CW20BuyTokenForm<T extends Token> = FormFunction<
  CW20BuyTokenFormInput<T>,
  CW20BuyTokenFormDependency,
  CW20BuyTokenFormStates<T>,
  CW20BuyTokenFormAsyncStates<T>
>;

export const cw20BuyTokenForm = <T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
  mantleEndpoint,
  mantleFetch,
  requestInit,
  ustBalance,
  tax,
  fixedGas,
  connected,
}: CW20BuyTokenFormDependency) => {
  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    ustBalance,
    tax,
    fixedGas,
  );

  return ({
    ustAmount,
    tokenAmount,
    maxSpread,
  }: CW20BuyTokenFormInput<T>): FormReturn<
    CW20BuyTokenFormStates<T>,
    CW20BuyTokenFormAsyncStates<T>
  > => {
    const ustAmountExists: boolean =
      !!ustAmount && ustAmount.length > 0 && big(ustAmount).gt(0);
    const tokenAmountExists: boolean =
      !!tokenAmount && tokenAmount.length > 0 && big(tokenAmount).gt(0);

    const invalidMaxSpread: string | null =
      maxSpread.length === 0 ? 'Max Spread is required' : null;

    if (!ustAmountExists && !tokenAmountExists) {
      return [
        {
          ustAmount,
          tokenAmount,
          maxSpread,
          maxUstAmount,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidUstAmount: null,
          warningNextTxFee: null,
          availableTx: false,
        },
        undefined,
      ];
    }

    if (ustAmountExists) {
      return [
        {
          ustAmount,
          maxUstAmount,
          maxSpread,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidUstAmount: null,
          warningNextTxFee: null,
          availableTx: false,
        },
        terraswapSimulationQuery(
          ustTokenPairAddr,
          {
            amount: microfy(ustAmount!).toFixed() as u<UST>,
            info: {
              native_token: {
                denom: 'uusd' as NativeDenom,
              },
            },
          },
          mantleEndpoint,
          mantleFetch,
          requestInit,
        ).then(
          ({
            simulation: { return_amount, commission_amount, spread_amount },
          }) => {
            const _tax = min(
              microfy(ustAmount!).mul(tax.taxRate),
              tax.maxTaxUUSD,
            ) as u<UST<Big>>;

            const beliefPrice = (
              big(return_amount).gt(0)
                ? microfy(ustAmount!).div(return_amount).toFixed()
                : '0'
            ) as UST;

            const rate = big(1).minus(maxSpread).toFixed() as Rate;

            const expectedAmount = microfy(ustAmount!)
              .div(beliefPrice)
              .minus(_tax) as u<UST<Big>>;

            const txFee = _tax.plus(fixedGas).toFixed() as u<UST>;

            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<T>;

            const invalidTxFee =
              connected && big(txFee).gt(ustBalance)
                ? 'Not enough transaction fees'
                : null;

            const invalidUstAmount =
              connected && microfy(ustAmount!).plus(txFee).gt(ustBalance)
                ? 'Not enough UST'
                : null;

            const availableTx =
              connected &&
              !invalidTxFee &&
              !invalidUstAmount &&
              !invalidMaxSpread &&
              !big(tradingFee).lte(0);

            const warningNextTxFee =
              connected &&
              availableTx &&
              big(ustBalance)
                .minus(microfy(ustAmount!))
                .minus(txFee)
                .lt(fixedGas)
                ? 'You may run out of USD balance needed for future transactions'
                : null;

            return {
              tokenAmount: demicrofy(return_amount).toFixed() as T,
              beliefPrice,
              txFee,
              minimumReceived: expectedAmount.mul(rate).toFixed() as u<T>,
              tradingFee,
              invalidTxFee,
              warningNextTxFee,
              invalidUstAmount,
              availableTx,
            };
          },
        ),
      ];
    } else if (tokenAmountExists) {
      return [
        {
          tokenAmount: tokenAmount,
          maxUstAmount,
          maxSpread,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidUstAmount: null,
          warningNextTxFee: null,
          availableTx: false,
        },
        terraswapSimulationQuery(
          ustTokenPairAddr,
          {
            amount: microfy(tokenAmount!).toFixed() as u<Token>,
            info: {
              token: {
                contract_addr: tokenAddr,
              },
            },
          },
          mantleEndpoint,
          mantleFetch,
          requestInit,
        ).then(
          ({
            simulation: { return_amount, spread_amount, commission_amount },
          }) => {
            const _tax = min(
              big(return_amount).mul(tax.taxRate),
              tax.maxTaxUUSD,
            ) as u<UST<Big>>;

            const beliefPrice = big(return_amount)
              .div(microfy(tokenAmount!))
              .toFixed() as UST;

            const expectedAmount = big(return_amount)
              .div(beliefPrice)
              .minus(_tax) as u<UST<Big>>;

            const rate = big(1).minus(maxSpread) as Rate<Big>;

            const txFee = _tax.plus(fixedGas).toFixed() as u<UST>;

            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<T>;

            const invalidUstAmount =
              connected && big(return_amount).plus(txFee).gt(ustBalance)
                ? 'Not enough UST'
                : null;

            const invalidTxFee =
              connected && big(txFee).gt(ustBalance)
                ? 'Not enough transaction fees'
                : null;

            const availableTx =
              connected &&
              !invalidTxFee &&
              !invalidUstAmount &&
              !invalidMaxSpread &&
              !big(tradingFee).lte(0);

            const warningNextTxFee =
              connected &&
              availableTx &&
              big(ustBalance).minus(return_amount).minus(txFee).lt(fixedGas)
                ? 'You may run out of USD balance needed for future transactions'
                : null;

            return {
              ustAmount: demicrofy(return_amount).toFixed() as UST,
              beliefPrice,
              txFee,
              minimumReceived: expectedAmount.mul(rate).toFixed() as u<T>,
              tradingFee,
              invalidUstAmount,
              invalidTxFee,
              warningNextTxFee,
              availableTx,
            };
          },
        ),
      ];
    }

    return [
      {
        ustAmount,
        tokenAmount,
        maxSpread,
        maxUstAmount,
        invalidMaxSpread,
        invalidTxFee: null,
        invalidUstAmount: null,
        warningNextTxFee: null,
        availableTx: false,
      },
      undefined,
    ];
  };
};
