import { max, min } from '@terra-dev/big-math';
import big from 'big.js';

describe('big-math', () => {
  test('should get the minimum / maximum numbers', () => {
    expect(min(10, '4', big('8')).toString()).toBe('4');
    expect(max(10, '4', big('8')).toString()).toBe('10');
  });
});
