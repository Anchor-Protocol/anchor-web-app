import { ANC, AncUstLP, Rate, UST, uUST } from '@anchor-protocol/types';

export interface AncUstLpSimulation<T> {
  poolPrice: uUST<T>;
  lpFromTx: AncUstLP<T>;
  shareOfPool: Rate<T>;
  txFee: uUST<T>;

  ancAmount?: ANC<T>;
  ustAmount?: UST<T>;
}
