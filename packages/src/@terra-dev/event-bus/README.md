# `@terra-dev/event-bus`

Simple React context API based Event Bus library.

## Usage

```jsx
// Setup
import { EventBusProvider } from '@terra-dev/event-bus';

<EventBusProvider>
  <YourApp />
</EventBusProvider>;
```

```jsx
// Dispatch
const { dispatch } from '@terra-dev/event-bus'

<button onClick={() => dispatch('some-event')}>
  Dispatch Event
</button>
```

```jsx
// Listen
const { useEventBusListener } from '@terra-dev/event-bus'

useEventBusListener('some-event', () => {
  // DO SOMETHING
})
```
