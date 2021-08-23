# `@libs/use-interval`

Simple `localStorage` wrapper hook.

```jsx
import { useLocalStorage } from '@libs/use-local-storage';

function Component() {
  const [value, setValue] = useLocalStorage(
    '__storage_value__',
    () => 'default value',
  );

  return (
    <div>
      <p>{value}</p>
      <button onClick={() => setValue('new value')}>Update Value</button>
    </div>
  );
}
```

And

```jsx
import { useLocalStorageJson } from '@libs/use-local-storage';

function Component() {
  const [value, setValue] = useLocalStorageJson('__storage_value__', () => ({
    value: 'default value',
  }));

  return (
    <div>
      <pre>{JSON.stringify(value, null, 2)}</pre>
      <button onClick={() => setValue({ value: 'new value' })}>
        Update Value
      </button>
    </div>
  );
}
```
