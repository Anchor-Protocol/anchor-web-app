import { NoMicro, Token, u, UST } from '@libs/types';
import { ANC, aUST, Native } from '@anchor-protocol/types';
import { BigSource } from 'big.js';

export interface FormatterOptions {
  decimals?: number;
  delimiter?: boolean;
}

export interface FormatterOutputOptions extends FormatterOptions {
  postFixUnits?: boolean;
}

export interface Formatter<T> {
  // format the given input into a valid output
  formatOutput(amount: T & NoMicro, options?: FormatterOutputOptions): string;

  // format the given input into a valid output
  formatInput(amount: BigSource): T;

  // microfy the amount
  microfy(amount: T & NoMicro): u<T>;

  // demicrofy the amount
  demicrofy(amount: u<T> | Token<BigSource>): T;

  // the token symbol that can be used to display
  symbol: string;

  // the number of decimals for the token
  decimals: number;
}

export interface Formatters {
  native: Formatter<Native>;
  ust: Formatter<UST>;
  aUST: Formatter<aUST>;
  anc: Formatter<ANC>;
}
