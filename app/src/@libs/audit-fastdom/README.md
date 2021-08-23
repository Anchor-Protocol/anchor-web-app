# `@libs/audit-fastdom`

Deduplicate [fastdom](https://www.npmjs.com/package/fastdom) callbacks.

![img.png](https://raw.githubusercontent.com/Anchor-Protocol/anchor-web-app/master/packages/src/%40terra-dev/audit-fastdom/readme-assets/img.png)

## API

<!-- source index.ts --pick "auditMeasure" -->

[index.ts](index.ts)

```ts
export function auditMeasure(fn: () => void): () => void {}
```

<!-- /source -->

## Usage

```js
//import { measure } from 'fastdom'
//
//window.addEventListener('wheel', () => {
//  measure(() => {
//    // do fastdom measure action
//  })
//})

import { auditMeasure } from '@libs/audit-fastdom';

const callback = auditMeasure(() => {
  // do fastdom measure action
});

window.addEventListener('wheel', () => {
  callback();
});
```
