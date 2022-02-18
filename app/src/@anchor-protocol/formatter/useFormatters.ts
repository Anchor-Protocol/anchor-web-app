import { useDeploymentTarget, Chain } from '@anchor-protocol/app-provider';
import { ANC, aUST, Native } from '@anchor-protocol/types';
import { NoMicro, u, UST } from '@libs/types';
import big from 'big.js';
import { useMemo } from 'react';
import { Formatters, Formatter, formatDecimal, FormatterOptions } from '.';

const ONE_MILLION = 1000000;

const createFormatter = <T>(symbol: string, decimals: number): Formatter<T> => {
  function formatter(amount: T & NoMicro, options?: FormatterOptions) {
    const { decimals, postFixUnits = true } = options ?? {};
    const value = big(amount.toString());

    if (big(value).gt(0) && big(value).lt(0.001)) {
      return '<0.001';
    }

    return value.gte(ONE_MILLION) && postFixUnits
      ? formatDecimal(value.div(ONE_MILLION), decimals ?? 2) + 'M'
      : formatDecimal(value, decimals ?? 3);
  }
  return Object.assign(formatter, {
    microfy: (amount: T & NoMicro): u<T> => {
      return big(amount.toString()).mul(Math.pow(10, decimals)) as any;
    },
    demicrofy: (amount: u<T>): T => {
      return big(amount.toString()).div(Math.pow(10, decimals)) as any;
    },
    symbol,
  });
};

const useFormatters = (): Formatters => {
  const { chain } = useDeploymentTarget();
  return useMemo<Formatters>(() => {
    switch (chain) {
      case Chain.Terra:
        return {
          native: createFormatter<Native>('LUNA', 6),
          ust: createFormatter<UST>('UST', 6),
          aUST: createFormatter<aUST>('aUST', 6),
          anc: createFormatter<ANC>('ANC', 6),
        };
      case Chain.Ethereum:
        return {
          native: createFormatter<Native>('ETH', 18),
          ust: createFormatter<UST>('UST', 6),
          aUST: createFormatter<aUST>('aUST', 6),
          anc: createFormatter<ANC>('ANC', 6),
        };
    }
  }, [chain]);
};

export { useFormatters };
