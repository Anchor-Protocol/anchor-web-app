/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { RouteHandlerCallbackOptions } from 'workbox-core/src/types';
import { ExpirationPlugin } from 'workbox-expiration';
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
  console.log('SERVICE WORKER UPDATED');
  self.skipWaiting();
  //event.waitUntil(() => {});
});

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');

const networkFirst = new NetworkFirst();
const boundIndexHtml = createHandlerBoundToURL(
  process.env.PUBLIC_URL + '/index.html',
);

const spaRoutesHandler = async (options: RouteHandlerCallbackOptions) => {
  return navigator.onLine
    ? networkFirst.handle(options)
    : await boundIndexHtml(options);
};

registerRoute(({ request, url }: { request: Request; url: URL }) => {
  if (
    request.mode !== 'navigate' ||
    url.pathname.startsWith('/_') ||
    url.pathname.match(fileExtensionRegexp)
  ) {
    return false;
  }

  return true;
}, spaRoutesHandler);

registerRoute(
  ({ url }) => {
    return url.origin === self.location.origin && url.pathname.endsWith('.png');
  },
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  }),
);
