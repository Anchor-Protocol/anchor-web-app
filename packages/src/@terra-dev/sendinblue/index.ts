import { useCallback, useState } from 'react';

interface Status {
  status: 'success' | 'in-progress' | 'ready';
}

interface Fault {
  status: 'error';
  message: string;
}

type Result = Status | Fault;

export function useSendinblueSubscription(
  apiKey: string,
): [(mail: string) => void, Result] {
  const [result, setResult] = useState<Result>({ status: 'ready' });

  const subscribe = useCallback(
    async (email: string) => {
      setResult({
        status: 'in-progress',
      });

      try {
        const res = await fetch('https://api.sendinblue.com/v3/contacts', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            email,
          }),
        });

        if (res.status > 201) {
          const json = (await res.json()) as { message: string };
          setResult({ status: 'error', message: json.message });
        } else {
          const json = (await res.json()) as { id: number };
          if (typeof json?.id === 'number') {
            setResult({ status: 'success' });
          }
        }
      } catch (e) {
        console.error(e);
        setResult({ status: 'error', message: e.toString() });
      }
    },
    [apiKey],
  );

  return [subscribe, result];
}
