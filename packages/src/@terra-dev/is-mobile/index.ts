import MobileDetect from 'mobile-detect';

export const isMobile = () => {
  const mobileDetect = new MobileDetect(navigator.userAgent);

  return !!mobileDetect.os();
};

export function useIsMobile() {
  return isMobile();
}
