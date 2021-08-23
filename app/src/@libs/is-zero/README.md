# `@libs/is-zero`

Check that the value is 0.

## Spec

<!-- source __tests__/*.test.ts -->

[\_\_tests\_\_/is-zero.test.ts](__tests__/is-zero.test.ts)

```ts
import big from 'big.js';
import { isZero } from '../';

test('is-zero', () => {
  expect(isZero('0')).toBeTruthy();
  expect(isZero(0)).toBeTruthy();
  expect(isZero(big('0'))).toBeTruthy();
  expect(isZero({ toString: () => '0' })).toBeTruthy();

  expect(isZero('1')).toBeFalsy();
  expect(isZero(1)).toBeFalsy();
  expect(isZero(big('1'))).toBeFalsy();
  expect(isZero({ toString: () => '1' })).toBeFalsy();
});
```

<!-- /source -->
