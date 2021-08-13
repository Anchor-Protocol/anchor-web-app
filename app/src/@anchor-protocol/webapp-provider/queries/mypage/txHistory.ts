import {
  MypageTxHistory,
  mypageTxHistoryQuery,
} from '@anchor-protocol/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback, useEffect, useState } from 'react';
import { useAnchorWebapp } from '../../contexts/context';

interface TxHistoryReturn {
  history: MypageTxHistory[];
  isLast: boolean;
  loadMore: () => void;
  reload: () => void;
  inProgress: boolean;
}

export function useMypageTxHistoryQuery(): TxHistoryReturn {
  const connectedWallet = useConnectedWallet();

  const { indexerApiEndpoint: endpoint } = useAnchorWebapp();

  const [history, setHistory] = useState<MypageTxHistory[]>([]);

  const [next, setNext] = useState<string | null>(null);

  const [inProgress, setInProgress] = useState<boolean>(true);

  const load = useCallback(() => {
    // initialize data
    setHistory([]);
    setNext(null);

    if (!connectedWallet) {
      setInProgress(false);
      return;
    }

    setInProgress(true);

    mypageTxHistoryQuery({
      endpoint,
      //walletAddress: 'terra1vz0k2glwuhzw3yjau0su5ejk3q9z2zj4ess86s',
      walletAddress: connectedWallet.walletAddress,
      offset: null,
    })
      .then(({ history, next }) => {
        setInProgress(false);
        setHistory(history);
        setNext(next);
      })
      .catch((error) => {
        console.error(error);
        setHistory([]);
        setNext(null);
        setInProgress(false);
      });
  }, [connectedWallet, endpoint]);

  const loadMore = useCallback(() => {
    if (history.length > 0 && !!next && connectedWallet) {
      setInProgress(true);

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

        setInProgress(false);
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
    inProgress,
  };
}
