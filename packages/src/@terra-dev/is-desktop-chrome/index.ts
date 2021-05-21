import { isMathWallet } from '@terra-dev/mathwallet';
import { getParser } from 'bowser';
import MobileDetect from 'mobile-detect';

export const isDesktopChrome = () => {
  const userAgent = navigator.userAgent;

  if (isMathWallet(userAgent)) {
    return true;
  }

  const browser = getParser(userAgent);
  const mobileDetect = new MobileDetect(navigator.userAgent);

  return (
    browser.satisfies({
      chrome: '>60',
      edge: '>80',
    }) && !mobileDetect.os()
  );
};

export function useIsDesktopChrome() {
  return isDesktopChrome();
}
