import { NominalType } from './common';

export type uaUST<T = string> = T & NominalType<'uaust'>;
export type aUST<T = string> = T & NominalType<'aust'>;

export type uUST<T = string> = T & NominalType<'uust'>;
export type UST<T = string> = T & NominalType<'ust'>;

export type uANC<T = string> = T & NominalType<'uanc'>;
export type ANC<T = string> = T & NominalType<'anc'>;

export type uLuna<T = string> = T & NominalType<'uluna'>;
export type Luna<T = string> = T & NominalType<'luna'>;

export type ubLuna<T = string> = T & NominalType<'ubluna'>;
export type bLuna<T = string> = T & NominalType<'bluna'>;

// Union currencies
export type uaToken<T = string> = T & NominalType<'uaust'>;

export type aToken<T = string> = T & NominalType<'aust'>;

export type uToken<T = string> = T &
  NominalType<'uaust' | 'uust' | 'uluna' | 'ubluna' | 'uanc'>;

export type Token<T = string> = T &
  NominalType<'aust' | 'ust' | 'luna' | 'bluna' | 'anc'>;
