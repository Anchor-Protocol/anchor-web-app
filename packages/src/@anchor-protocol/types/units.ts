import { NominalType } from './common';

export type Rate<T = string> = T & NominalType<'ratio'>;

export type Percent<T = string> = T & NominalType<'percent'>;

export type Num<T = string> = T & NominalType<'number'>;

export type JSDateTime = number & NominalType<'jsdatetime'>;

export type DateTime = number & NominalType<'datetime'>;
