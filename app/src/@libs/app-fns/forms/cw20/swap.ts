import { demicrofy, microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { CW20Addr, HumanAddr, Rate, Token, u, UST } from '@libs/types';
import { FormFunction, FormReturn } from '@libs/use-form';
import big from 'big.js';
import { terraswapSimulationQuery } from '../../queries/terraswap/simulation';

export interface CW20SwapTokenFormInput<From extends Token, To extends Token> {
  fromAmount?: From;
  toAmount?: To;
  maxSpread: Rate;
}

export interface CW20SwapTokenFormDependency<
  From extends Token,
  To extends Token,
> {
  queryClient: QueryClient;
  //
  swapPairAddr: HumanAddr;
  fromTokenAddr: CW20Addr;
  toTokenAddr: CW20Addr;
  //
  ustBalance: u<UST>;
  fromTokenBalance: u<From>;
  toTokenBalance: u<To>;
  fixedFee: u<UST>;
  //
  connected: boolean;
}

export interface CW20SwapTokenFormStates<From extends Token, To extends Token>
  extends CW20SwapTokenFormInput<From, To> {
  invalidMaxSpread: string | null;
  invalidTxFee: string | null;
  invalidFromAmount: string | null;
  invalidToAmount: string | null;
  availableTx: boolean;
}

export type CW20SwapTokenFormAsyncStates<To extends Token> = {
  beliefPrice: To;
  txFee: u<UST>;
  minimumReceived: u<To>;
  tradingFee: u<To>;
};

export type CW20SwapTokenForm<
  From extends Token,
  To extends Token,
> = FormFunction<
  CW20SwapTokenFormInput<From, To>,
  CW20SwapTokenFormDependency<From, To>,
  CW20SwapTokenFormStates<From, To>,
  CW20SwapTokenFormAsyncStates<To>
>;

export const cw20SwapTokenForm = <From extends Token, To extends Token>({
  fromTokenAddr,
  fromTokenBalance,
  toTokenAddr,
  swapPairAddr,
  toTokenBalance,
  ustBalance,
  queryClient,
  fixedFee,
  connected,
}: CW20SwapTokenFormDependency<From, To>) => {
  return ({
    toAmount,
    maxSpread,
    fromAmount,
  }: CW20SwapTokenFormInput<From, To>): FormReturn<
    CW20SwapTokenFormStates<From, To>,
    CW20SwapTokenFormAsyncStates<To>
  > => {
    const fromAmountExists: boolean =
      !!fromAmount && fromAmount.length > 0 && big(fromAmount).gt(0);
    const toAmountExists: boolean =
      !!toAmount && toAmount.length > 0 && big(toAmount).gt(0);

    const invalidMaxSpread: string | null =
      maxSpread.length === 0 ? 'Max Spread is required' : null;

    if (!fromAmountExists && !toAmountExists) {
      return [
        {
          fromAmount,
          toAmount,
          maxSpread,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidFromAmount: null,
          invalidToAmount: null,
          availableTx: false,
        },
        undefined,
      ];
    }

    if (fromAmountExists) {
      return [
        {
          fromAmount,
          maxSpread,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidFromAmount: null,
          invalidToAmount: null,
          availableTx: false,
        },
        terraswapSimulationQuery(
          swapPairAddr,
          {
            amount: microfy(fromAmount!).toFixed() as u<From>,
            info: {
              token: {
                contract_addr: fromTokenAddr,
              },
            },
          },
          queryClient,
        ).then(
          ({
            simulation: { return_amount, commission_amount, spread_amount },
          }) => {
            const beliefPrice = microfy(return_amount)
              .div(fromAmount!)
              .toFixed() as To;
            const expectedAmount = microfy(fromAmount!).mul(beliefPrice); // u<To<Big>>
            const rate = big(1).minus(maxSpread).toFixed() as Rate;
            const minimumReceived = expectedAmount.mul(rate).toFixed() as u<To>;

            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<To>;

            const invalidTxFee =
              connected && big(fixedFee).gt(ustBalance)
                ? 'Not enough transaction fees'
                : null;

            const invalidFromAmount =
              connected && microfy(fromAmount!).gt(fromTokenBalance)
                ? 'Not enough asset'
                : null;

            const availableTx =
              connected &&
              !invalidFromAmount &&
              !invalidMaxSpread &&
              !big(tradingFee).lte(0);

            return {
              toAmount: demicrofy(return_amount).toFixed() as To,
              beliefPrice,
              txFee: fixedFee,
              minimumReceived,
              tradingFee,
              invalidTxFee,
              invalidFromAmount,
              availableTx,
            };
          },
        ),
      ];
    } else if (toAmountExists) {
      return [
        {
          toAmount,
          maxSpread,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidFromAmount: null,
          invalidToAmount: null,
          availableTx: false,
        },
        terraswapSimulationQuery(
          swapPairAddr,
          {
            amount: microfy(toAmount!).toFixed() as u<From>,
            info: {
              token: {
                contract_addr: toTokenAddr,
              },
            },
          },
          queryClient,
        ).then(
          ({
            simulation: { return_amount, spread_amount, commission_amount },
          }) => {
            const beliefPrice = big(1)
              .div(big(return_amount).div(toAmount!))
              .toFixed() as To;
            const expectedAmount = big(toAmount!).div(beliefPrice);
            const rate = big(1).minus(maxSpread);

            const minimumReceived = expectedAmount.mul(rate).toFixed() as u<To>;
            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<To>;

            const invalidTxFee =
              connected && big(fixedFee).gt(ustBalance)
                ? 'Not enough transaction fees'
                : null;

            const invalidToAmount =
              connected && microfy(toAmount!).gt(toTokenBalance)
                ? 'Not enough asset'
                : null;

            const availableTx =
              connected &&
              !invalidToAmount &&
              !invalidMaxSpread &&
              !big(tradingFee).lte(0);

            return {
              fromAmount: demicrofy(return_amount).toFixed() as From,
              beliefPrice,
              txFee: fixedFee,
              minimumReceived,
              tradingFee,
              invalidTxFee,
              invalidToAmount,
              availableTx,
            };
          },
        ),
      ];
    }

    return [
      {
        fromAmount,
        toAmount,
        maxSpread,
        invalidMaxSpread,
        invalidTxFee: null,
        invalidFromAmount: null,
        invalidToAmount: null,
        availableTx: false,
      },
      undefined,
    ];
  };
};
