# `useResolveLast()`

<https://anchor-storybook.vercel.app/?path=/story/packages-use-resolve-last--basic>

```tsx
import { useResolveLast } from '@libs/use-resolve-last';

const delay = (value: number, ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function Component() {
  const [resolve, result] = useResolveLast<number>();

  useEffect(() => {
    resolve(1); // resolve(T)
    resolve(delay(2, 1000)); // resolve(Promise<T>)
    resolve(delay(3, 100));
    resolve(delay(4, 300));
    resolve(delay(5, 10)); // last resolve
  }, []);

  // result will be 5
  // previously resolves will be ignored

  return <div>should "{result}" is 5</div>;
}
```

It is helpful when you make a fetch requests by user input.

<!-- source ./__stories__/use-resolve-last.stories.tsx -->

[\_\_stories\_\_/use-resolve-last.stories.tsx](__stories__/use-resolve-last.stories.tsx)

```tsx
import { useResolveLast } from '@libs/use-resolve-last/index';
import React from 'react';

export default {
  title: 'packages/use-resolve-last',
};

const someFetch = (value: string) =>
  new Promise<number>((resolve) =>
    setTimeout(() => {
      console.log('fetch result is', value);
      resolve(parseInt(value));
    }, Math.random() * 3000),
  );

export const Basic = () => {
  const [resolve, result] = useResolveLast<number>(() => 0);

  return (
    <div>
      <input
        type="number"
        defaultValue={0}
        onChange={({ target }) => resolve(someFetch(target.value))}
      />
      <p>the latest resolve value is "{result}"</p>
    </div>
  );
};
```

<!-- /source -->
