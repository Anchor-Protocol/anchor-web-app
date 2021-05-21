import * as Sentry from '@sentry/react';
import { configErrorBoundary } from '@terra-dev/neumorphism-ui/components/configErrorBoundary';
import { SENTRY_DSN } from 'base/env';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN,
    //integrations: [new Integrations.BrowserTracing()],
    //tracesSampleRate: 1.0,
    maxValueLength: 800,
  });

  configErrorBoundary(Sentry.ErrorBoundary);
}

ReactDOM.render(<App />, document.getElementById('root'));

reportWebVitals();
