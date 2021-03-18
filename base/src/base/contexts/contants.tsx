import type { Rate, uUST } from '@anchor-protocol/types';
import type { ReactNode } from 'react';
import { Consumer, Context, createContext, useContext } from 'react';

export interface ConstantsProviderProps extends Constants {
  children: ReactNode;
}

export interface Constants {
  gasFee: uUST<number>;
  fixedGas: uUST<number>;
  gasAdjustment: Rate<number>;
  blocksPerYear: number;
}

// @ts-ignore
const ConstantsContext: Context<Constants> = createContext<Constants>();

export function ConstantsProvider({
  children,
  ...constants
}: ConstantsProviderProps) {
  return (
    <ConstantsContext.Provider value={constants}>
      {children}
    </ConstantsContext.Provider>
  );
}

export function useConstants(): Constants {
  return useContext(ConstantsContext);
}

export const ConstantsConsumer: Consumer<Constants> = ConstantsContext.Consumer;
