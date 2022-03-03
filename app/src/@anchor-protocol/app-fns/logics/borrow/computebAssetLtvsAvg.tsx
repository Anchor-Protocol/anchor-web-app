import { BAssetLtv, BAssetLtvs } from '@anchor-protocol/app-fns';
import { Rate } from '@anchor-protocol/types';
import big from 'big.js';

export function computebAssetLtvsAvg(bAssetLtvs: BAssetLtvs): BAssetLtv {
  const bAssetLtvsSum = Array.from(bAssetLtvs).reduce(
    (total, [, { max, safe }]) => {
      return {
        max: big(total.max).plus(max).toFixed() as Rate,
        safe: big(total.safe).plus(safe).toFixed() as Rate,
      };
    },
    { max: '0' as Rate, safe: '0' as Rate },
  );

  return {
    max: big(bAssetLtvsSum.max).div(bAssetLtvs.size).toFixed() as Rate,
    safe: big(bAssetLtvsSum.safe).div(bAssetLtvs.size).toFixed() as Rate,
  };
}
