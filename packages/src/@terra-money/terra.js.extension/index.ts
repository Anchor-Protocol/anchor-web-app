import { Extension } from './Extension';
import { ExtensionV1 } from './v1/ExtensionV1';
import { ExtensionV2 } from './v2/ExtensionV2';

const waitingTimeout = () =>
  new Promise<0>((resolve) => {
    setTimeout(() => resolve(0), 20 * 1000);
  });

const waitingExtensionV1 = () =>
  new Promise<1>((resolve) => {
    let i = -1;
    const count = 10;
    const intervalMs = 500;

    function check() {
      if (++i < count) {
        if (!!window.isTerraExtensionAvailable) {
          resolve(1);
        } else {
          setTimeout(check, intervalMs);
        }
      }
    }

    check();
  });

const waitingExtensionV2 = () =>
  new Promise<2 | 0>((resolve) => {
    const meta = document.querySelector('meta[name="terra-connect"]');

    if (!meta) {
      resolve(0);
      return;
    }

    let i = -1;
    const count = 10;
    const intervalMs = 500;

    function check() {
      if (++i < count) {
        const meta = document.querySelector('meta[name="terra-connect"]');

        if (meta && meta.hasAttribute('connected')) {
          resolve(2);
        } else {
          setTimeout(check, intervalMs);
        }
      }
    }

    check();
  });

let extension: Extension;

export async function createExtension(): Promise<Extension> {
  if (extension) return extension;

  const version = await Promise.race([
    waitingTimeout(),
    waitingExtensionV1(),
    waitingExtensionV2(),
  ]);

  console.log(`USE TERRA CROME EXTENSION V${version}`);

  extension = version === 2 ? new ExtensionV2() : new ExtensionV1();
  return extension;
}
