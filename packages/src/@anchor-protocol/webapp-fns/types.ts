import { Rate, uUST } from '@anchor-protocol/types';

export interface AnchorContants {
  gasFee: uUST<number>;
  fixedGas: uUST<number>;
  blocksPerYear: number;
  gasAdjustment: Rate<number>;
}
