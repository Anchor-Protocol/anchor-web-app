import { NoMicro, u, UST } from '@libs/types';
import { ANC, aUST, Native } from '@anchor-protocol/types';

export interface FormatterOptions {
  decimals?: number;
  postFixUnits?: boolean;
}

export interface Formatter<T> {
  // format the default amount
  (amount: T & NoMicro, options?: FormatterOptions): string;

  // microfy the amount
  microfy(amount: T & NoMicro): u<T>;

  // demicrofy the amount
  demicrofy(amount: u<T>): T;

  // the token symbol that can be used to display
  symbol: string;
}

export interface Formatters {
  native: Formatter<Native>;
  ust: Formatter<UST>;
  aUST: Formatter<aUST>;
  anc: Formatter<ANC>;
}
