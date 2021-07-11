import { CW20Addr, ubAsset } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { createCollateralVector } from '../../models/collaterals';

export const vectorizeVariations = createCollateralVector(
  (item: [CW20Addr, ubAsset<BigSource>]) => {
    return item;
  },
  big(0) as ubAsset<Big>,
);
