import { useEffect, useRef } from 'react';

interface Props {
  longtime: number;
  onSee: (longtime: number) => void;
}

export function useLongtimeNoSee({ longtime, onSee }: Props) {
  const onSeeRef = useRef(onSee);
  const longtimeRef = useRef(longtime);

  useEffect(() => {
    onSeeRef.current = onSee;
  }, [onSee]);

  useEffect(() => {
    longtimeRef.current = longtime;
  }, [longtime]);

  useEffect(() => {
    let lastInvisibleTime = -1;

    function callback() {
      if (document.hidden) {
        lastInvisibleTime = Date.now();
      } else if (lastInvisibleTime > 0) {
        const t = Date.now() - lastInvisibleTime;
        if (t > longtimeRef.current) {
          onSeeRef.current(t);
        }
        lastInvisibleTime = -1;
      }
    }

    document.addEventListener('visibilitychange', callback);

    return () => {
      document.removeEventListener('visibilitychange', callback);
    };
  }, []);
}

export function LongtimeNoSee(props: Props) {
  useLongtimeNoSee(props);
  return null;
}
