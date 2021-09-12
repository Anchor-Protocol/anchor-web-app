import * as Sentry from '@sentry/react';
import { configErrorBoundary } from '@libs/neumorphism-ui/components/configErrorBoundary';
import { SENTRY_DSN } from 'env';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';

if (process.env.NODE_ENV === 'production' && typeof SENTRY_DSN === 'string') {
  Sentry.init({
    dsn: SENTRY_DSN,
    //integrations: [new Integrations.BrowserTracing()],
    //tracesSampleRate: 1.0,
    maxValueLength: 800,
    ignoreErrors: [
      // may some lib (maybe chart.js) have problem this error in some browsers https://github.com/WICG/resize-observer/issues/38
      // but, failed investigating. this error still investigation
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications.',
      // Ignore user actions
      'User Denied',
    ],
  });

  configErrorBoundary(Sentry.ErrorBoundary);
}

ReactDOM.render(<App />, document.getElementById('root'));

reportWebVitals();
