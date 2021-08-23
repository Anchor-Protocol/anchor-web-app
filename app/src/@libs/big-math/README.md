# `@libs/big-math`

Math library for [big.js](https://github.com/MikeMcl/big.js/)

## API

<!-- source index.ts --pick "min max floor" -->

[index.ts](index.ts)

```ts
export function min(...numbers: BigSource[]): Big {}

export function max(...numbers: BigSource[]): Big {}

export function floor(number: BigSource): Big {}
```

<!-- /source -->

## Spec

<!-- source ./__tests__/*.test.ts -->

[\_\_tests\_\_/big-math.test.ts](__tests__/big-math.test.ts)

```ts
import { floor, max, min } from '@libs/big-math';
import big from 'big.js';

describe('big-math', () => {
  test('should get the minimum / maximum numbers', () => {
    expect(min(10, '4', big('8')).toString()).toBe('4');
    expect(max(10, '4', big('8')).toString()).toBe('10');
    expect(floor(big('10.343434')).toString()).toBe('10');
  });
});
```

<!-- /source -->
