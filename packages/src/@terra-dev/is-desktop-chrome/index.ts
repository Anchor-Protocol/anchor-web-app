import { getParser } from 'bowser';
import MobileDetect from 'mobile-detect';

export const isDesktopChrome = () => {
  const browser = getParser(navigator.userAgent);
  const mobileDetect = new MobileDetect(navigator.userAgent);

  return (
    browser.satisfies({
      chrome: '>60',
      edge: '>80',
      firefox: '>80',
      safari: '>=14',
    }) && !mobileDetect.os()
  );
};

export function useIsDesktopChrome() {
  return isDesktopChrome();
}
