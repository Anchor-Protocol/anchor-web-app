import { min } from '@libs/big-math';
import { demicrofy, microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { CW20Addr, HumanAddr, Rate, Token, u, UST } from '@libs/types';
import { FormFunction, FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';
import { terraswapSimulationQuery } from '../../queries/terraswap/simulation';

export interface CW20SellTokenFormInput<T extends Token> {
  ustAmount?: UST;
  tokenAmount?: T;
  maxSpread: Rate;
}

export interface CW20SellTokenFormDependency<T extends Token> {
  queryClient: QueryClient;
  //
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
  //
  ustBalance: u<UST>;
  tokenBalance: u<T>;
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
  fixedFee: u<UST<BigSource>>;
  //
  connected: boolean;
}

export interface CW20SellTokenFormStates<T extends Token>
  extends CW20SellTokenFormInput<T> {
  tokenBalance: u<T>;
  invalidMaxSpread: string | null;
  invalidTxFee: string | null;
  invalidTokenAmount: string | null;
  availableTx: boolean;
}

export type CW20SellTokenFormAsyncStates<T extends Token> = (
  | { ustAmount: UST }
  | { tokenAmount: T }
) & {
  beliefPrice: T;
  txFee: u<UST>;
  minimumReceived: u<UST>;
  tradingFee: u<UST>;
};

export type CW20SellTokenForm<T extends Token> = FormFunction<
  CW20SellTokenFormInput<T>,
  CW20SellTokenFormDependency<T>,
  CW20SellTokenFormStates<T>,
  CW20SellTokenFormAsyncStates<T>
>;

export const cw20SellTokenForm = <T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
  queryClient,
  //mantleEndpoint,
  //mantleFetch,
  //requestInit,
  ustBalance,
  tokenBalance,
  taxRate,
  maxTaxUUSD,
  fixedFee,
  connected,
}: CW20SellTokenFormDependency<T>) => {
  return ({
    ustAmount,
    tokenAmount,
    maxSpread,
  }: CW20SellTokenFormInput<T>): FormReturn<
    CW20SellTokenFormStates<T>,
    CW20SellTokenFormAsyncStates<T>
  > => {
    const ustAmountExists: boolean =
      !!ustAmount && ustAmount.length > 0 && big(ustAmount).gt(0);
    const ctAmountExists: boolean =
      !!tokenAmount && tokenAmount.length > 0 && big(tokenAmount).gt(0);

    const invalidMaxSpread: string | null =
      maxSpread.length === 0 ? 'Max Spread is required' : null;

    if (!ustAmountExists && !ctAmountExists) {
      return [
        {
          ustAmount,
          tokenAmount: tokenAmount,
          maxSpread,
          tokenBalance,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidTokenAmount: null,
          availableTx: false,
        },
        undefined,
      ];
    }

    if (ctAmountExists) {
      return [
        {
          tokenAmount: tokenAmount,
          tokenBalance,
          maxSpread,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidTokenAmount: null,
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
          queryClient,
        ).then(
          ({
            simulation: { return_amount, spread_amount, commission_amount },
          }) => {
            const _tax = min(
              big(return_amount).minus(
                big(return_amount).div(big(1).plus(taxRate)),
              ),
              maxTaxUUSD,
            ) as u<UST<Big>>;

            const beliefPrice = microfy(tokenAmount!)
              .div(return_amount)
              .toFixed() as T;

            const rate = big(1).minus(maxSpread).toFixed() as Rate;

            const expectedAmount = big(return_amount).minus(_tax) as u<
              UST<Big>
            >;

            const txFee = _tax.plus(fixedFee).toFixed() as u<UST>;

            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<UST>;

            const minimumReceived = expectedAmount
              .mul(rate)
              .toFixed() as u<UST>;

            const invalidTxFee =
              connected && big(fixedFee).gt(ustBalance)
                ? 'Not enough transaction fees'
                : null;

            const invalidTokenAmount =
              connected && microfy(tokenAmount!).gt(tokenBalance)
                ? 'Not enough assets'
                : null;

            const availableTx =
              connected &&
              !invalidTxFee &&
              !invalidTokenAmount &&
              !invalidMaxSpread &&
              !big(tradingFee).lte(0);

            return {
              ustAmount: demicrofy(return_amount).toFixed() as UST,
              beliefPrice,
              txFee,
              minimumReceived,
              tradingFee,
              invalidTxFee,
              invalidTokenAmount,
              availableTx,
            };
          },
        ),
      ];
    } else if (ustAmountExists) {
      return [
        {
          ustAmount,
          tokenBalance,
          maxSpread,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidTokenAmount: null,
          availableTx: false,
        },
        terraswapSimulationQuery(
          ustTokenPairAddr,
          {
            amount: microfy(ustAmount!).toFixed() as u<UST>,
            info: {
              native_token: {
                denom: 'uusd',
              },
            },
          },
          queryClient,
        ).then(
          ({
            simulation: { return_amount, spread_amount, commission_amount },
          }) => {
            const _tax = min(
              microfy(ustAmount!).minus(
                microfy(ustAmount!).div(big(1).plus(taxRate)),
              ),
              maxTaxUUSD,
            ) as u<UST<Big>>;

            const beliefPrice = (
              big(return_amount).gt(0)
                ? big(1).div(microfy(ustAmount!).div(return_amount).toFixed())
                : '0'
            ) as T;

            const expectedAmount = big(return_amount)
              .minus(_tax)
              .toFixed() as u<T>;

            const rate = big(1).minus(maxSpread) as Rate<Big>;

            const txFee = _tax.plus(fixedFee).toFixed() as u<UST>;

            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<UST>;

            const minimumReceived = big(expectedAmount)
              .mul(rate)
              .toFixed() as u<UST>;

            const invalidTxFee =
              connected && big(fixedFee).gt(ustBalance)
                ? 'Not enough transaction fees'
                : null;

            const invalidTokenAmount =
              connected && big(return_amount).gt(tokenBalance)
                ? 'Not enough assets'
                : null;

            const availableTx =
              connected &&
              !invalidTxFee &&
              !invalidTokenAmount &&
              !invalidMaxSpread &&
              !big(tradingFee).lte(0);

            return {
              tokenAmount: demicrofy(return_amount).toFixed() as T,
              beliefPrice,
              txFee,
              minimumReceived,
              tradingFee,
              invalidTokenAmount,
              invalidTxFee,
              availableTx,
            };
          },
        ),
      ];
    }

    return [
      {
        ustAmount,
        tokenAmount: tokenAmount,
        maxSpread,
        tokenBalance,
        invalidMaxSpread,
        invalidTxFee: null,
        invalidTokenAmount: null,
        availableTx: false,
      },
      undefined,
    ];
  };
};
