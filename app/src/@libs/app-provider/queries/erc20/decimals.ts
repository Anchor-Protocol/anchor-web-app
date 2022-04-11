import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEffect, useState } from 'react';

export const useERC20Decimals = (tokenContract: string | undefined) => {
  const [decimals, setDecimals] = useState<number | undefined>(undefined);
  const xAnchor = useEvmCrossAnchorSdk();

  useEffect(() => {
    async function fetchDecimals() {
      if (tokenContract !== undefined) {
        const result = await xAnchor.decimals(tokenContract);
        setDecimals(result);
      }
    }
    fetchDecimals();
  }, [xAnchor, tokenContract]);

  return decimals;
};
