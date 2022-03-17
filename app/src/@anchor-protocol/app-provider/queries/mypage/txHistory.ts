import {
  MypageTxHistory,
  mypageTxHistoryQuery,
} from '@anchor-protocol/app-fns';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';

interface TxHistoryReturn {
  history: MypageTxHistory[];
  isLast: boolean;
  loadMore: () => void;
  reload: () => void;
  inProgress: boolean;
}

export function useMypageTxHistoryQuery(): TxHistoryReturn {
  const { connected, terraWalletAddress } = useAccount();

  const { indexerApiEndpoint: endpoint } = useAnchorWebapp();

  const [history, setHistory] = useState<MypageTxHistory[]>([]);

  const [next, setNext] = useState<string | null>(null);

  const [inProgress, setInProgress] = useState<boolean>(true);

  const load = useCallback(() => {
    // initialize data
    setHistory([]);
    setNext(null);

    if (!connected || !terraWalletAddress) {
      setInProgress(false);
      return;
    }

    setInProgress(true);

    mypageTxHistoryQuery({
      endpoint,
      walletAddress: terraWalletAddress,
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
  }, [connected, terraWalletAddress, endpoint]);

  const loadMore = useCallback(() => {
    if (history.length > 0 && !!next && connected && terraWalletAddress) {
      setInProgress(true);

      mypageTxHistoryQuery({
        endpoint,
        walletAddress: terraWalletAddress,
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
  }, [connected, terraWalletAddress, endpoint, history.length, next]);

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
