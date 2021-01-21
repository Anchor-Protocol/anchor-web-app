import { max, min } from '@anchor-protocol/big-math';
import big from 'big.js';

describe('big-math', () => {
  test('should get the minimum number', () => {
    expect(min(10, '4', big('8')).toString()).toBe('4');
    expect(max(10, '4', big('8')).toString()).toBe('10');
  });
});
