import {
  MypageTxHistory,
  mypageTxHistoryQuery,
} from '@anchor-protocol/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface TxHistoryReturn {
  history: MypageTxHistory[];
  isLast: boolean;
  loadMore: () => void;
  reload: () => void;
}

export function useMypageTxHistoryQuery(): TxHistoryReturn {
  const connectedWallet = useConnectedWallet();

  const endpoint = useMemo(() => {
    return 'https://api.anchorprotocol.com';
  }, []);

  const [history, setHistory] = useState<MypageTxHistory[]>([]);

  const [next, setNext] = useState<string | null>(null);

  const load = useCallback(() => {
    // initialize data
    setHistory([]);
    setNext(null);

    if (!connectedWallet) {
      return;
    }

    mypageTxHistoryQuery({
      endpoint,
      //walletAddress: 'terra1vz0k2glwuhzw3yjau0su5ejk3q9z2zj4ess86s',
      walletAddress: connectedWallet.walletAddress,
      offset: null,
    }).then(({ history, next }) => {
      setHistory(history);
      setNext(next);
    });
  }, [connectedWallet, endpoint]);

  const loadMore = useCallback(() => {
    if (history.length > 0 && !!next && connectedWallet) {
      mypageTxHistoryQuery({
        endpoint,
        //walletAddress: 'terra1vz0k2glwuhzw3yjau0su5ejk3q9z2zj4ess86s',
        walletAddress: connectedWallet.walletAddress,
        offset: next,
      }).then(({ history, next }) => {
        setHistory((prev) => {
          return Array.isArray(history) && history.length > 0
            ? [...prev, ...history]
            : prev;
        });

        setNext(next);
      });
    }
  }, [connectedWallet, endpoint, history.length, next]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    history,
    isLast: !next,
    reload: load,
    loadMore,
  };
}
