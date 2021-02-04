import { Ratio, uUST } from '@anchor-protocol/notation';
import type { ReactNode } from 'react';
import { Consumer, Context, createContext, useContext } from 'react';

export interface NetConstantsProviderProps extends NetConstants {
  children: ReactNode;
}

export interface NetConstants {
  gasFee: uUST<number>;
  fixedGas: uUST<number>;
  gasAdjustment: Ratio<number>;
  blocksPerYear: number;
}

// @ts-ignore
const NetConstantsContext: Context<NetConstants> = createContext<NetConstants>();

export function NetConstantsProvider({
  children,
  ...constants
}: NetConstantsProviderProps) {
  return (
    <NetConstantsContext.Provider value={constants}>
      {children}
    </NetConstantsContext.Provider>
  );
}

export function useNetConstants(): NetConstants {
  return useContext(NetConstantsContext);
}

export const NetConstantsConsumer: Consumer<NetConstants> =
  NetConstantsContext.Consumer;
