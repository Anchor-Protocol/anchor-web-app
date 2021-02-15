/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { ExpirationPlugin } from 'workbox-expiration';
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
  console.log('SERVICE WORKER UPDATED');
  self.skipWaiting();
  //event.waitUntil(() => {});
});

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');

registerRoute(({ request, url }: { request: Request; url: URL }) => {
  if (
    request.mode !== 'navigate' ||
    url.pathname.startsWith('/_') ||
    url.pathname.match(fileExtensionRegexp)
  ) {
    return false;
  }

  return true;
}, createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'));

registerRoute(
  ({ url }) => {
    return url.origin === self.location.origin && url.pathname.endsWith('.png');
  },
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  }),
);
