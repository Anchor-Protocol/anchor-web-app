# `@anchor-protocol/notation`

TODO

## Spec

<!-- source __tests__/*.test.ts -->

[\_\_tests\_\_/notation.test.ts](__tests__/notation.test.ts)

```ts
import { aUST, bLuna, Luna, Percent, Rate, UST } from '@anchor-protocol/types';
import { formatPercentage, formatRate } from '@libs/formatter';
import {
  formatAUST,
  formatAUSTInput,
  formatAUSTWithPostfixUnits,
  formatLuna,
  formatLunaInput,
  formatUST,
  formatUSTInput,
  formatUSTWithPostfixUnits,
} from '../';

describe('notation', () => {
  test('should format numbers to the correct strings', () => {
    expect(formatUST('1.342131' as UST)).toBe('1.342');
    expect(formatUST('1.12049312' as UST)).toBe('1.12');
    expect(formatUST('1.10049312' as UST)).toBe('1.1');
    expect(formatUST('0.0001' as UST)).toBe('<0.001');

    expect(formatAUST('1.00049312' as aUST)).toBe('1.000493');
    expect(formatAUST('1000.1234000' as aUST)).toBe('1,000.1234');
    expect(formatAUST('1000.120000' as aUST)).toBe('1,000.12');

    expect(formatUSTWithPostfixUnits('1342131' as UST)).toBe('1.34M');
    expect(formatUSTWithPostfixUnits('1342131.34432' as UST)).toBe('1.34M');
    expect(formatUSTWithPostfixUnits('1100493' as UST)).toBe('1.1M');
    expect(formatUSTWithPostfixUnits('1100493.2435' as UST)).toBe('1.1M');
    expect(formatUSTWithPostfixUnits('11103452' as UST)).toBe('11.1M');
    expect(formatUSTWithPostfixUnits('1000345' as UST)).toBe('1M');
    expect(formatUSTWithPostfixUnits('1000345000' as UST)).toBe('1,000.34M');

    expect(formatAUSTWithPostfixUnits('10003450' as aUST)).toBe('10.003M');
    expect(formatAUSTWithPostfixUnits('1120.33434' as aUST)).toBe(
      '1,120.33434',
    );
    expect(formatAUSTWithPostfixUnits('1123.4000' as aUST)).toBe('1,123.4');
    expect(formatAUSTWithPostfixUnits('1120.000' as aUST)).toBe('1,120');
    expect(formatAUSTWithPostfixUnits('1000' as aUST)).toBe('1,000');
    expect(formatAUSTWithPostfixUnits('1010' as aUST)).toBe('1,010');

    expect(formatLuna('1.342131' as Luna)).toBe('1.342131');
    expect(formatLuna('1.12049312' as Luna)).toBe('1.120493');
    expect(formatLuna('1.1004000' as Luna)).toBe('1.1004');
    expect(formatLuna('1.00049312' as bLuna)).toBe('1.000493');
    expect(formatLuna('1000.1234000' as bLuna)).toBe('1,000.1234');
    expect(formatLuna('1000.120000' as bLuna)).toBe('1,000.12');

    expect(formatPercentage('1.342131' as Percent)).toBe('1.34');
    expect(formatPercentage('1.12049312' as Percent)).toBe('1.12');
    expect(formatPercentage('1.1004000' as Percent)).toBe('1.1');
    expect(formatPercentage('1.00049312' as Percent)).toBe('1');
    expect(formatPercentage('1000.1234000' as Percent)).toBe('1,000.12');
    expect(formatPercentage('1000.120000' as Percent)).toBe('1,000.12');
    expect(formatPercentage('-1000.120000' as Percent)).toBe('-1,000.12');

    expect(formatRate('0.00725188639837987036' as Rate)).toBe('0.72');
    expect(formatRate('-0.00725188639837987036' as Rate)).toBe('-0.72');

    expect(formatUSTInput('10.3436' as UST)).toBe('10.343');
    expect(formatAUSTInput('10.00' as aUST)).toBe('10');

    expect(formatLunaInput('10.3436' as Luna)).toBe('10.3436');
    expect(formatLunaInput('10.00' as bLuna)).toBe('10');
  });

  test('error cases', () => {
    expect(formatRate('0.195545188517526138' as Rate)).toBe('19.55');
  });
});
```

<!-- /source -->

## Stories

<https://anchor-storybook.vercel.app/?path=/story/components-animatenumber--basic>
