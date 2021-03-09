import { Luna, uLuna } from '@anchor-protocol/types/currencies';
import { Big, BigSource } from 'big.js';

describe('types/currencies', () => {
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
