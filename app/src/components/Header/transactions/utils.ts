import { useEffect, useState } from 'react';

export const useExecuteOnceWhen = (
  execute: () => void,
  when: () => boolean,
) => {
  const [executed, setExecuted] = useState<boolean>();

  useEffect(() => {
    if (!executed && when()) {
      setExecuted(true);
      execute();
    }
  }, [executed, setExecuted, when, execute]);
};
