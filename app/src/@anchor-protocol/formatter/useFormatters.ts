import { useDeploymentTarget, Chain } from '@anchor-protocol/app-provider';
import { ANC, aUST, Native, Token } from '@anchor-protocol/types';
import { NoMicro, u, UST } from '@libs/types';
import big, { BigSource } from 'big.js';
import { useMemo } from 'react';
import {
  Formatters,
  Formatter,
  formatDecimal,
  FormatterOptions,
  FormatterOutputOptions,
} from '.';

const ONE_MILLION = 1000000;

const createFormatter = <T>(
  symbol: string,
  tokenDecimals: number,
): Formatter<T> => {
  return {
    formatOutput: (amount: T & NoMicro, options?: FormatterOutputOptions) => {
      const { decimals, postFixUnits = true, delimiter = true } = options ?? {};
      const value = big(amount.toString());

      if (big(value).gt(0) && big(value).lt(0.001)) {
        return '<0.001';
      }

      return value.gte(ONE_MILLION) && postFixUnits
        ? formatDecimal(value.div(ONE_MILLION), decimals ?? 2, delimiter) + 'M'
        : formatDecimal(value, decimals ?? 3, delimiter);
    },
    formatInput: (amount: BigSource, options?: FormatterOptions): T => {
      const { decimals = tokenDecimals, delimiter = true } = options ?? {};
      return formatDecimal(amount, decimals, delimiter) as any;
    },
    microfy: (amount: T & NoMicro): u<T> => {
      return big(amount.toString()).mul(Math.pow(10, tokenDecimals)) as any;
    },
    demicrofy: (amount: u<T> | Token<BigSource>): T => {
      return big(amount.toString()).div(Math.pow(10, tokenDecimals)) as any;
    },
    symbol,
  };
};

const useFormatters = (): Formatters => {
  const {
    target: { chain },
  } = useDeploymentTarget();
  return useMemo<Formatters>(() => {
    const tokens = {
      ust: createFormatter<UST>('UST', 6),
      aUST: createFormatter<aUST>('aUST', 6),
      anc: createFormatter<ANC>('ANC', 6),
    };
    switch (chain) {
      case Chain.Terra:
        return {
          ...tokens,
          native: createFormatter<Native>('LUNA', 6),
        };
      case Chain.Ethereum:
        return {
          ...tokens,
          native: createFormatter<Native>('ETH', 18),
        };
      case Chain.Avalanche:
        return {
          ...tokens,
          native: createFormatter<Native>('AVAX', 18),
        };
    }
  }, [chain]);
};

export { useFormatters };
