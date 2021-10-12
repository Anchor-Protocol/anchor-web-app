import {
  AUD,
  CAD,
  CHF,
  CNY,
  DKK,
  EUR,
  GBP,
  HKD,
  IDR,
  INR,
  JPY,
  KRW,
  Luna,
  MNT,
  NOK,
  PHP,
  SDR,
  SEK,
  SGD,
  THB,
  u,
  UST,
} from '@libs/types';

export interface GasPrice {
  uluna: u<Luna>;
  uaud: u<AUD>;
  ucad: u<CAD>;
  uchf: u<CHF>;
  ucny: u<CNY>;
  udkk: u<DKK>;
  ueur: u<EUR>;
  ugbp: u<GBP>;
  uhkd: u<HKD>;
  uidr: u<IDR>;
  uinr: u<INR>;
  ujpy: u<JPY>;
  ukrw: u<KRW>;
  umnt: u<MNT>;
  unok: u<NOK>;
  uphp: u<PHP>;
  usdr: u<SDR>;
  usek: u<SEK>;
  usgd: u<SGD>;
  uthb: u<THB>;
  uusd: u<UST>;
}
