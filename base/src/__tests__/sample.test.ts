import { max } from '@terra-dev/big-math';

describe('sample', () => {
  test('sample test', () => {
    expect(max('1', '2', '-1').toString()).toBe('2');
  });
});
