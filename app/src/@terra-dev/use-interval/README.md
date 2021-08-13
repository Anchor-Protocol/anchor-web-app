# `@terra-dev/use-interval`

Simple `setInterval()` wrapper hook.

```jsx
import { useInterval } from '@terra-dev/use-interval';

function Component() {
  const [tick, setTick] = useState(0);

  useInterval(() => {
    setTick((prev) => prev + 1);
  }, 1000);

  return <div>{tick}</div>;
}
```
