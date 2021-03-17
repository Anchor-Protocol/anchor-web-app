# `@terra-dev/sendinblue`

```jsx
import {
  useEmailInput,
  useSendinblueSubscription,
} from '@terra-dev/sendinblue';

function Component() {
  const [email, setEmail, validEmail] = useEmailInput();

  const [subscribeEmail, { status }] = useSendinblueSubscription(YOUR_API_KEY);

  return (
    <>
      <input
        type="text"
        value={email}
        onChange={({ target }) => setEmail(target.value)}
      />
      <button
        disabled={!validEmail || status === 'in-progress'}
        onClick={() => subscribeEmail(email)}
      >
        Subscribe
      </button>
    </>
  );
}
```
