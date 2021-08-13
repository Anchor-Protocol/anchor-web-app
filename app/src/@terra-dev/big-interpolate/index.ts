import big, { Big, BigSource } from 'big.js';
import { easeLinear } from 'd3-ease';

export interface Options {
  /** start value */
  from: BigSource;

  /** end value */
  to: BigSource;

  /** ease function (e.g. import { easeQuadInOut } from 'd3-ease') */
  ease?: (nomalizedTime: number) => number;
}

export const interpolateBig = ({
  from,
  to,
  ease = easeLinear,
}: Options): ((e: number) => Big) => {
  const gap = big(to).minus(from);

  return (elapsed: number) => {
    return big(from).plus(gap.mul(ease(elapsed)));
  };
};
