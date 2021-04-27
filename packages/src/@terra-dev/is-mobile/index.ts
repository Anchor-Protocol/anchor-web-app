import MobileDetect from 'mobile-detect';
import { useMemo } from 'react';

export const isMobile = () => {
  const mobileDetect = new MobileDetect(navigator.userAgent);

  return !!mobileDetect.os();
};

export function useIsMobile() {
  return useMemo(() => isMobile(), []);
}
