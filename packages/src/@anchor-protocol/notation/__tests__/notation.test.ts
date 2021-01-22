import { Big, BigSource } from 'big.js';
import {
  formatLuna,
  formatLunaInput,
  formatPercentage,
  formatUST,
  formatUSTInput,
  formatUSTWithPostfixUnits,
  Luna,
  Percent,
  uLuna,
} from '../';

describe('notation', () => {
  test('should format numbers to the correct strings', () => {
    expect(formatUST('1.342131')).toBe('1.342');
    expect(formatUST('1.12049312')).toBe('1.12');
    expect(formatUST('1.10049312')).toBe('1.1');
    expect(formatUST('1.00049312')).toBe('1');
    expect(formatUST('1000.1234000')).toBe('1,000.123');
    expect(formatUST('1000.120000')).toBe('1,000.12');

    expect(formatUSTWithPostfixUnits('1342131')).toBe('1.34M');
    expect(formatUSTWithPostfixUnits('1342131.34432')).toBe('1.34M');
    expect(formatUSTWithPostfixUnits('1100493')).toBe('1.1M');
    expect(formatUSTWithPostfixUnits('1100493.2435')).toBe('1.1M');
    expect(formatUSTWithPostfixUnits('11103452')).toBe('11.1M');
    expect(formatUSTWithPostfixUnits('1000345')).toBe('1M');
    expect(formatUSTWithPostfixUnits('1000345000')).toBe('1,000.34M');
    expect(formatUSTWithPostfixUnits('10003450')).toBe('10M');
    expect(formatUSTWithPostfixUnits('1120.33434')).toBe('1,120.334');
    expect(formatUSTWithPostfixUnits('1123.4000')).toBe('1,123.4');
    expect(formatUSTWithPostfixUnits('1120.000')).toBe('1,120');
    expect(formatUSTWithPostfixUnits('1000')).toBe('1,000');
    expect(formatUSTWithPostfixUnits('1010')).toBe('1,010');

    expect(formatLuna('1.342131')).toBe('1.342131');
    expect(formatLuna('1.12049312')).toBe('1.120493');
    expect(formatLuna('1.1004000')).toBe('1.1004');
    expect(formatLuna('1.00049312')).toBe('1.000493');
    expect(formatLuna('1000.1234000')).toBe('1,000.1234');
    expect(formatLuna('1000.120000')).toBe('1,000.12');

    expect(formatPercentage('1.342131' as Percent)).toBe('1.34');
    expect(formatPercentage('1.12049312' as Percent)).toBe('1.12');
    expect(formatPercentage('1.1004000' as Percent)).toBe('1.1');
    expect(formatPercentage('1.00049312' as Percent)).toBe('1');
    expect(formatPercentage('1000.1234000' as Percent)).toBe('1,000.12');
    expect(formatPercentage('1000.120000' as Percent)).toBe('1,000.12');

    expect(formatUSTInput('10.3436')).toBe('10.343');
    expect(formatUSTInput('10.00')).toBe('10');

    expect(formatLunaInput('10.3436')).toBe('10.3436');
    expect(formatLunaInput('10.00')).toBe('10');
  });

  test('type casting of nominal types', () => {
    const currency: uLuna = '100' as uLuna;

    // Can type cast to its physical type
    const str: string = currency;

    // BigSource is an union type = string | number | Big
    // Can type cast from uLuna<string> to uLuna<string | number | Big>
    const uLunaBigSource: uLuna<BigSource> = currency;

    // @ts-expect-error Can not type cast from uLuna<string> to Luna<string | number | Big>
    const lunaBigSource: Luna<BigSource> = currency;

    expect(new Set([currency, str, uLunaBigSource, lunaBigSource]).size).toBe(
      1,
    );

    function fn1(amount: string) {}

    function fn2(amount: uLuna) {}

    function fn3(amount: uLuna<BigSource>) {}

    function fn4(amount: uLuna<Big>) {}

    function fn5(amount: Luna) {}

    fn1(currency);
    fn2(currency);
    fn3(currency);
    // @ts-expect-error
    fn4(currency);
    // @ts-expect-error
    fn5(currency);

    const source: uLuna<BigSource> = '100' as uLuna<BigSource>;

    // @ts-expect-error
    const str2: string = source;

    // @ts-expect-error
    const uLunaString2: uLuna = source;

    // @ts-expect-error
    const lunaBigSource2: Luna<BigSource> = source;

    expect(new Set([source, str2, uLunaString2, lunaBigSource2]).size).toBe(1);
  });
});
