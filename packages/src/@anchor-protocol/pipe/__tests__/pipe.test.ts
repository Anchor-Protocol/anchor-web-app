import { asyncPipe, pipe } from '@anchor-protocol/pipe';

describe('pipe', () => {
  test('should get result from pipe', () => {
    expect(
      pipe(
        (x: number) => x.toString(),
        (y: string) => parseInt(y),
      )(10),
    ).toBe(10);

    expect(
      pipe(
        (x: number) => x.toString(),
        (y: string) => parseInt(y),
        (z: number) => z.toString(),
      )(10),
    ).toBe('10');
  });

  test('should get result from asyncPipe', async () => {
    const lazy = <T>(v: T) =>
      new Promise<T>((resolve) => setTimeout(() => resolve(v), 100));

    await expect(
      asyncPipe(
        (x: number) => x.toString(),
        (y: string) => parseInt(y),
      )(10),
    ).resolves.toBe(10);

    await expect(
      asyncPipe(
        (x: number) => x.toString(),
        (y: string) => parseInt(y),
        (z: number) => z.toString(),
      )(10),
    ).resolves.toBe('10');

    await expect(
      asyncPipe(
        (x: number) => lazy(x.toString()),
        (y: string) => lazy(parseInt(y)),
      )(10),
    ).resolves.toBe(10);

    await expect(
      asyncPipe(
        (x: number) => lazy(x.toString()),
        (y: string) => lazy(parseInt(y)),
        (z: number) => lazy(z.toString()),
      )(10),
    ).resolves.toBe('10');
  });
});
