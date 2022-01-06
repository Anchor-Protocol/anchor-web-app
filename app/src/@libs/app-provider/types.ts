import { Gas, HumanAddr, Rate } from '@libs/types';

export interface QueryRefetch {
  queryKey: string;
  wait?: number;
}

export type TxRefetchMap = Record<string, (string | QueryRefetch)[]>;

export interface AppContractAddress {
  terraswap: {
    factory: HumanAddr;
  };
  astroport: {
    generator: HumanAddr;
  };
}

export interface AppConstants {
  gasWanted: Gas;
  fixedGas: Gas;
  blocksPerYear: number;
  gasAdjustment: Rate<number>;
}
