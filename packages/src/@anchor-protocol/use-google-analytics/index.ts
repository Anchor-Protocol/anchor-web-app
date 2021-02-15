import { useEffect } from 'react';
import { initialize, pageview, set } from 'react-ga';
import { useLocation } from 'react-router-dom';

export function useGoogleAnalytics(trackingId: string) {
  const location = useLocation();

  useEffect(() => {
    initialize(trackingId, {
      debug: process.env.NODE_ENV === 'development',
    });
  }, [trackingId]);

  useEffect(() => {
    const path = location.pathname + location.search;

    set({ page: path });
    pageview(path);
  }, [location]);
}

export function GoogleAnalytics({ trackingId }: { trackingId: string }) {
  useGoogleAnalytics(trackingId);
  return null;
}
