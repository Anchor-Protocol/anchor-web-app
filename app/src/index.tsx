import { configErrorBoundary } from '@terra-dev/neumorphism-ui/components/configErrorBoundary';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { SENTRY_DSN } from '@anchor-protocol/web-contexts/env';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { unregister } from './serviceWorkderRegistration';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],

    tracesSampleRate: 1.0,
  });

  configErrorBoundary(Sentry.ErrorBoundary);
}

ReactDOM.render(<App />, document.getElementById('root'));

//register();
unregister();
reportWebVitals();
