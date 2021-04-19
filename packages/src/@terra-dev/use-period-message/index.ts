import { useCallback, useState } from 'react';

const key = (id: string) => `__anchor_hide_message_${id}__`;

export function usePeriodMessage(params: {
  id: string;
  period: number;
}): [hidden: boolean, hide: () => void] {
  const [hidden, setHidden] = useState<boolean>(() => {
    const end = localStorage.getItem(key(params.id));

    if (!end) {
      return false;
    }

    return +end > Date.now();
  });

  const hide = useCallback(() => {
    localStorage.setItem(
      key(params.id),
      (Date.now() + params.period).toString(),
    );

    setHidden(true);
  }, [params]);

  return [hidden, hide];
}
