//@ts-ignore
window.global = window;

import('@libs/vite-polyfills/polyfills').then(() => import('./main'));
