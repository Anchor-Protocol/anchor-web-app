import ResizeObserverPolyfill from 'resize-observer-polyfill';

//@ts-ignore
window.global = window;

if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = ResizeObserverPolyfill;
}

import('@libs/vite-polyfills/polyfills').then(() => import('./main'));
