# `@libs/use-time-end`

Print the remain times

<https://anchor-storybook.vercel.app/?path=/story/packages-use-time-end--component>

## API

<!-- source index.ts --pick "timeGap useTimeEnd TimeEnd" -->

[index.ts](index.ts)

```ts
export function useTimeEnd(endTime: Date): string {}

export function TimeEnd({ endTime }: { endTime: Date }) {}

export const timeGap = (endTime: Date, now: Date) => {};
```

<!-- /source -->

## Spec

<!-- source __tests__/*.test.ts -->

[\_\_tests\_\_/use-time-end.test.ts](__tests__/use-time-end.test.ts)

```ts
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
```

<!-- /source -->

## Stories

<!-- source __stories__/*.stories.tsx -->

[\_\_stories\_\_/use-time-end.stories.tsx](__stories__/use-time-end.stories.tsx)

```tsx
import React from 'react';
import { DAY, HOUR, MINUTE, useTimeEnd, TimeEnd } from '../';

export default {
  title: 'packages/use-time-end',
};

export const Hook = () => {
  const p = useTimeEnd(new Date(Date.now() - DAY));
  const m30 = useTimeEnd(new Date(Date.now() + MINUTE * 30));
  const h2 = useTimeEnd(new Date(Date.now() + HOUR * 2));
  const d2 = useTimeEnd(new Date(Date.now() + DAY * 2));
  const d9 = useTimeEnd(new Date(Date.now() + DAY * 9));

  return (
    <ul>
      <li>{p}</li>
      <li>{m30}</li>
      <li>{h2}</li>
      <li>{d2}</li>
      <li>{d9}</li>
    </ul>
  );
};

export const Component = () => {
  return (
    <ul>
      <li>
        <TimeEnd endTime={new Date(Date.now() - DAY)} />
      </li>
      <li>
        <TimeEnd endTime={new Date(Date.now() + MINUTE * 30)} />
      </li>
      <li>
        <TimeEnd endTime={new Date(Date.now() + HOUR * 2)} />
      </li>
      <li>
        <TimeEnd endTime={new Date(Date.now() + DAY * 2)} />
      </li>
      <li>
        <TimeEnd endTime={new Date(Date.now() + DAY * 9)} />
      </li>
    </ul>
  );
};
```

<!-- /source -->
