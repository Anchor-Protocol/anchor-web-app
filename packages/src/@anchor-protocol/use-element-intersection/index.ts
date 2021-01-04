import { RefObject, useCallback, useEffect, useState } from 'react';

interface Params extends IntersectionObserverInit {
  elementRef: RefObject<HTMLElement>;
}

export function useElementIntersection({
  elementRef,
  threshold,
  root,
  rootMargin,
}: Params) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const onScroll = useCallback(([entry]: IntersectionObserverEntry[]) => {
    setEntry(entry);
  }, []);

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    const observer: IntersectionObserver = new IntersectionObserver(onScroll, {
      threshold,
      root,
      rootMargin,
    });
    observer.observe(elementRef.current);

    return () => {
      observer && observer.disconnect();
    };
  }, [elementRef, onScroll, root, rootMargin, threshold]);

  return entry;
}
