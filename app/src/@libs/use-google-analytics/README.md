# `@libs/use-google-analytics`

In this time, there are no suitable Google Analytics's new `gtag` supported library.

This library only support `gtag`. If you want to use the legacy Google Anlaytics you can make better that use `react-ga`

## Usage

```jsx
import { GoogleAnalytics } from '@libs/use-google-analytics';

function App() {
  return (
    <>
      <GoogleAnalytics trackingId={YOUR_TRACKING_ID} />
      <App />
    </>
  );
}
```

Or

```jsx
import { useGoogleAnalytics } from '@libs/use-google-analytics';

function App() {
  useGoogleAnalytics({ trackingId: YOUR_TRACKING_ID });

  return <App />;
}
```
