export type Unit<T extends 'ratio' | 'percent' | 'number'> = { __nominal: T };

export type Ratio<T = string> = T & Unit<'ratio'>;

export type Percent<T = string> = T & Unit<'percent'>;

export type Num<T = string> = T & Unit<'number'>;
