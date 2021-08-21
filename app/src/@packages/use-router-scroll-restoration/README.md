# `@packages/use-router-scroll-restoration`

Scroll restore to 0,0 when the router path is changed

```js
import { useRouterScrollRestoration } from '@packages/use-router-scroll-restoration';

function App() {
  useRouterScrollRestoration();

  return <YOUR_APP />;
}
```

Or

```js
import { RouterScrollRestoration } from '@packages/use-router-scroll-restoration';

function App() {
  return (
    <div>
      <RouterScrollRestoration />
      <YOUR_APP />
    </div>
  );
}
```
