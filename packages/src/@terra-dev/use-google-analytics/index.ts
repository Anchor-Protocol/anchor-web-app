import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const gtag = (trackingId: string) => `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${trackingId}');
`;

export function useGoogleAnalytics(
  trackingId: string,
  debug: boolean = process.env.NODE_ENV !== 'production',
) {
  const location = useLocation();
  const trackingIdRef = useRef<string>(trackingId);
  const debugRef = useRef<boolean>(debug);

  useEffect(() => {
    if (!debugRef.current) {
      const script1 = document.createElement('script');
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingIdRef.current}`;
      script1.async = true;

      document.body.appendChild(script1);

      const script2 = document.createElement('script');
      script2.text = gtag(trackingIdRef.current);

      document.body.appendChild(script2);
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
