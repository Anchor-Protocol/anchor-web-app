# `@libs/big-interpolate`

Interpolate function for [Big.js](https://www.npmjs.com/package/big.js)

## API

<!-- source index.ts --pick "Options interpolateBig" -->

[index.ts](index.ts)

```ts
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
}: Options): ((e: number) => Big) => {};
```

<!-- /source -->

## Spec

<!-- source __tests__/*.test.ts -->

[\_\_tests\_\_/interpolateBig.test.ts](__tests__/interpolateBig.test.ts)

```ts
import { interpolateBig } from '@libs/big-interpolate/index';

describe('interpolateBig', () => {
  test('should get right value', () => {
    const interpolate = interpolateBig({
      from: 0,
      to: 100,
    });

    expect(interpolate(0).toNumber()).toBe(0);
    expect(interpolate(0.5).toNumber()).toBe(50);
    expect(interpolate(1).toNumber()).toBe(100);
  });
});
```

<!-- /source -->
