//@ts-ignore
window.global = window;

import('@packages/vite-polyfills/polyfills').then(() => import('./main'));
