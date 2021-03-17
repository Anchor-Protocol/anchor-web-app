import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useRouterScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

export function RouterScrollRestoration() {
  useRouterScrollRestoration();

  return null;
}
