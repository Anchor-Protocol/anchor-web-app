import { timeGap } from '@libs/use-time-end';

describe('use-time-end', () => {
  test('should get time gap', () => {
    const now = new Date(Date.parse('Thu, Feb 18 2020 00:00:00 GMT'));

    expect(
      timeGap(new Date(Date.parse('Wed, Feb 17 2020 18:30:00 GMT')), now),
    ).toBe('00:00:00');

    expect(
      timeGap(new Date(Date.parse('Thu, Feb 18 2020 00:00:30 GMT')), now),
    ).toBe('00:00:30');

    expect(
      timeGap(new Date(Date.parse('Thu, Feb 18 2020 00:30:30 GMT')), now),
    ).toBe('00:30:30');

    expect(
      timeGap(new Date(Date.parse('Thu, Feb 18 2020 10:30:30 GMT')), now),
    ).toBe('10:30:30');

    expect(
      timeGap(new Date(Date.parse('Thu, Feb 25 2020 10:30:30 GMT')), now),
    ).toBe('7 Days');
  });
});
