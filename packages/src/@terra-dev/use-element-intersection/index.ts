import { RefObject, useEffect, useState } from 'react';

export interface ElementIntersectionParams extends IntersectionObserverInit {
  elementRef: RefObject<HTMLElement>;
  observeOnce?: boolean;
}

export function useElementIntersection({
  elementRef,
  threshold,
  root,
  rootMargin,
  observeOnce = false,
}: ElementIntersectionParams) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    function observerCallback([entry]: IntersectionObserverEntry[]) {
      setEntry(entry);

      if (entry.isIntersecting && observeOnce === true && elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    }

    const observer: IntersectionObserver = new IntersectionObserver(
      observerCallback,
      {
        threshold,
        root,
        rootMargin,
      },
    );

    observer.observe(elementRef.current);

    return () => {
      observer && observer.disconnect();
    };
  }, [elementRef, observeOnce, root, rootMargin, threshold]);

  return entry;
}
