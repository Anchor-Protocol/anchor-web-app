import { bAsset, CW20Addr, u } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { createCollateralVector } from '../../models/collaterals';

export const vectorizeVariations = createCollateralVector(
  (item: [CW20Addr, u<bAsset<BigSource>>]) => {
    return item;
  },
  big(0) as u<bAsset<Big>>,
);
