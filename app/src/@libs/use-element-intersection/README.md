# `@libs/use-element-intersection`

<https://anchor-storybook.vercel.app/?path=/story/packages-use-element-intersection--basic>

## API

<!-- source index.ts --pick "ElementIntersectionParams useElementIntersection" -->

[index.ts](index.ts)

```ts
export function useElementIntersection({
  elementRef,
  threshold,
  root,
  rootMargin,
  observeOnce = false,
}: ElementIntersectionParams) {}

export interface ElementIntersectionParams extends IntersectionObserverInit {
  elementRef: RefObject<HTMLElement>;
  observeOnce?: boolean;
}
```

<!-- /source -->

## Examples

<!-- source __stories__/*.stories.tsx -->

[\_\_stories\_\_/use-element-intersection.stories.tsx](__stories__/use-element-intersection.stories.tsx)

```tsx
import { useElementIntersection } from '@libs/use-element-intersection';
import React, { useRef } from 'react';
import styled from 'styled-components';

export default {
  title: 'packages/use-element-intersection',
};

export const Basic = () => {
  const elementRef = useRef<HTMLElement>(null);

  const intersection = useElementIntersection({ elementRef, threshold: 0.2 });

  return (
    <div>
      <div style={{ backgroundColor: 'red', height: 1500 }} />
      <div
        ref={elementRef as any}
        style={{ backgroundColor: 'white', height: 500 }}
      />
      <div style={{ backgroundColor: 'blue', height: 1500 }} />
      <Intersecting>
        {intersection?.isIntersecting
          ? 'White block is visible'
          : 'White block is invisible'}
      </Intersecting>
    </div>
  );
};

export const Observe_Once = () => {
  const elementRef = useRef<HTMLElement>(null);

  const intersection = useElementIntersection({
    elementRef,
    threshold: 0.5,
    observeOnce: true,
  });

  return (
    <div>
      <div style={{ backgroundColor: 'red', height: 1500 }} />
      <div
        ref={elementRef as any}
        style={{ backgroundColor: 'white', height: 500 }}
      />
      <div style={{ backgroundColor: 'blue', height: 1500 }} />
      <Intersecting>
        {intersection?.isIntersecting
          ? 'White block is appeared'
          : 'White block is still not appeared'}
      </Intersecting>
    </div>
  );
};

const Intersecting = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: grid;
  place-content: center;
  border-radius: 15px;
  padding: 20px;
`;
```

<!-- /source -->
