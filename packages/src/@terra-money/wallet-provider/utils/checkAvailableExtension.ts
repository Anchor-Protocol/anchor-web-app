import { isMathWallet } from '@terra-dev/mathwallet';
import { ConnectType } from '../types';

const interval = 500;

export async function checkAvailableExtension(
  timeout: number,
): Promise<ConnectType.CHROME_EXTENSION | ConnectType.WEBEXTENSION | null> {
  return new Promise<
    ConnectType.CHROME_EXTENSION | ConnectType.WEBEXTENSION | null
  >((resolve) => {
    if (isMathWallet(navigator.userAgent)) {
      resolve(ConnectType.CHROME_EXTENSION);
      return;
    }

    const start = Date.now();

    function check() {
      const meta = window.document.querySelector(
        'head > meta[name="terra-webextension"]',
      );

      if (meta?.getAttribute('connected') === 'true') {
        resolve(ConnectType.WEBEXTENSION);
      } else if (window['isTerraExtensionAvailable'] === true) {
        resolve(ConnectType.CHROME_EXTENSION);
      } else if (Date.now() > start + timeout) {
        resolve(null);
      } else {
        setTimeout(check, interval);
      }
    }

    setTimeout(check, interval);
  });
}
