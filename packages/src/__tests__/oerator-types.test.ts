export async function* createAsyncIterableIterator(): AsyncIterator<
  string,
  number
> {
  let n: number = 0;

  while (true) {
    yield 'string' + n;

    n += 1;

    if (n > 3) {
      return 100;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export async function* createAsyncIterator(
  a: number,
  b: number,
): AsyncIterator<
  Partial<{ a: number; b: number; c: number }>,
  { a: number; b: number; c: number }
> {
  const ab = { a, b };

  yield ab;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { ...ab, c: a + b };
}

export async function createPromise(): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return 'xxx';
}

function isAsyncIterator(v: unknown): v is AsyncIterator<any> {
  return v instanceof Object && Symbol.asyncIterator in v;
}

test('check oerator-types', async () => {
  async function proc(v: AsyncIterator<any> | Promise<any>) {
    if (isAsyncIterator(v)) {
      const snapshot: any[] = [];

      while (true) {
        const { value, done } = await v.next();

        snapshot.push(value);

        if (done) {
          return snapshot;
        }
      }
    } else {
      return await Promise.resolve(v);
    }
  }

  const x: AsyncIterator<any> | Promise<any> = createAsyncIterableIterator();
  const y: AsyncIterator<any> | Promise<any> = createAsyncIterator(10, 20);
  const z: AsyncIterator<any> | Promise<any> = createPromise();

  await expect(proc(x)).resolves.toEqual([
    'string0',
    'string1',
    'string2',
    'string3',
    100,
  ]);
  await expect(proc(y)).resolves.toEqual([
    { a: 10, b: 20 },
    { a: 10, b: 20, c: 30 },
  ]);
  await expect(proc(z)).resolves.toBe('xxx');
}, 100000);

test('iterator', async () => {
  const x: AsyncIterator<any> = createAsyncIterableIterator();

  await expect(x.next()).resolves.toEqual({ done: false, value: 'string0' });
  await expect(x.next()).resolves.toEqual({ done: false, value: 'string1' });
  await expect(x.next()).resolves.toEqual({ done: false, value: 'string2' });
  await expect(x.next()).resolves.toEqual({ done: false, value: 'string3' });
  await expect(x.next()).resolves.toEqual({ done: true, value: 100 });
});
