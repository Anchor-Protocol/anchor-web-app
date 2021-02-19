import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function useGoogleAnalytics(
  trackingId: string,
  debug: boolean = process.env.NODE_ENV !== 'production',
) {
  const location = useLocation();
  const trackingIdRef = useRef<string>(trackingId);
  const debugRef = useRef<boolean>(debug);

  useEffect(() => {
    if (!debugRef.current) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingIdRef.current}`;
      script.async = true;

      document.body.appendChild(script);

      window.dataLayer = window.dataLayer || [];

      window.gtag = (...args: any[]) => {
        window.dataLayer?.push(...args);
      };

      window.gtag('js', new Date());

      window.gtag('config', trackingIdRef.current);
    } else {
      console.log('GTAG INIT:', trackingIdRef.current);
    }
  }, []);

  useEffect(() => {
    if (!debugRef.current && window.gtag) {
      window.gtag('config', trackingIdRef.current, {
        page_location: location.pathname + location.search,
        page_path: location.pathname,
      });
    } else if (debugRef.current) {
      console.log('GTAG PUSH: ', location.pathname + location.search);
    }
  }, [location]);
}

export function GoogleAnalytics({
  trackingId,
  debug = process.env.NODE_ENV !== 'production',
}: {
  trackingId: string;
  debug?: boolean;
}) {
  useGoogleAnalytics(trackingId, debug);
  return null;
}
