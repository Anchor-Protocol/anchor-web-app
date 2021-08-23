import { NominalType } from '@libs/types';

export type u<T = string> = T & { __micro: true };
export type NoMicro = { __micro?: false };

// Native currencies
export type UST<T = string> = T & NominalType<'ust'>;
export type KRT<T = string> = T & NominalType<'krt'>;
export type Luna<T = string> = T & NominalType<'luna'>;

// LP currencies
export type LP<T = string> = T & NominalType<'lp'>;

// Union currencies
export type NativeToken<T = string> = T & NominalType<'ust' | 'krt' | 'luna'>;

// All currencies
export type Token<T = string> = T & NominalType<string>;
