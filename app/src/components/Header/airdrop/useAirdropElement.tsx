import React, { useCallback, useMemo, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useAirdropCheckQuery } from '@anchor-protocol/app-provider';
import { AirdropContent } from './AirdropContent';

let _airdropClosed: boolean = false;

export function useAirdropElement(open: boolean) {
  const { data: airdrop, isLoading: airdropIsLoading } = useAirdropCheckQuery();
  const matchAirdrop = useRouteMatch('/airdrop');
  const [airdropClosed, setAirdropClosed] = useState(() => _airdropClosed);

  const closeAirdrop = useCallback(() => {
    setAirdropClosed(true);
    _airdropClosed = true;
  }, []);

  return useMemo(() => {
    return airdrop &&
      !open &&
      !airdropClosed &&
      !airdropIsLoading &&
      !matchAirdrop ? (
      <AirdropContent onClose={closeAirdrop} isMobileLayout />
    ) : null;
  }, [
    airdrop,
    airdropClosed,
    airdropIsLoading,
    closeAirdrop,
    matchAirdrop,
    open,
  ]);
}
