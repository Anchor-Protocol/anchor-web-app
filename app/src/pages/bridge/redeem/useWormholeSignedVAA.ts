import { useState } from 'react';

type WormholeSignedVAAReturn = {
  loading: boolean;
  vaa?: string;
};

const useWormholeSignedVAA = (
  chainId: number,
  sequence: number,
): WormholeSignedVAAReturn => {
  const [response, setResponse] = useState<WormholeSignedVAAReturn>({
    loading: true,
  });

  setTimeout(() => {
    setResponse({ loading: false });
  }, 3000);

  return response;
};

export { useWormholeSignedVAA };
