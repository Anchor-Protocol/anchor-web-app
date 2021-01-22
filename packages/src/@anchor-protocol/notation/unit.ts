export type Unit<T extends 'ratio' | 'percent'> = { __nominal: T };

export type Ratio<T = string> = T & Unit<'ratio'>;

export type Percent<T = string> = T & Unit<'percent'>;
