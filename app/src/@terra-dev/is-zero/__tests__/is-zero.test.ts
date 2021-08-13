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
