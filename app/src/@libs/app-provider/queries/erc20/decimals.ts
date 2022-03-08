import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEffect, useState } from 'react';

export const DEFAULT_ERC20_DECIMALS = 18;

export const useERC20Decimals = (tokenContract: string) => {
  const [decimals, setDecimals] = useState<number>(DEFAULT_ERC20_DECIMALS);
  const xAnchor = useEvmCrossAnchorSdk();

  useEffect(() => {
    async function fetchDecimals() {
      const result = await xAnchor.decimals(tokenContract);
      setDecimals(result);
    }

    fetchDecimals();
  }, [xAnchor, tokenContract]);

  return decimals;
};
