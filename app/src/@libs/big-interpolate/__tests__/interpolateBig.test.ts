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
