import { NetworkInfo } from '@terra-dev/wallet-types';
import { useWallet } from '@terra-money/wallet-provider';
import { useCallback, useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { MantleFetch } from '../context';

interface Props {
  mantleEndpoints: Record<string, string>;
  mantleFetch: MantleFetch;
  intervalMs?: number;
}

// language=graphql
const query = `
  query {
    LastSyncedHeight
  }
`;

interface Data {
  LastSyncedHeight: number;
}

export interface BlockHeightBoundNetwork {
  network: NetworkInfo;
  blockHeight: number;
  refetchBlockHeight: () => Promise<number>;
}

export function useBlockHeightBoundNetwork({
  mantleEndpoints,
  mantleFetch,
  intervalMs = 1000 * 60 * 3,
}: Props): BlockHeightBoundNetwork {
  const { network } = useWallet();

  const [states, setStates] = useState<
    Omit<BlockHeightBoundNetwork, 'refetchBlockHeight'>
  >(() => ({
    network,
    blockHeight: 0,
  }));

  const [controller] = useState<BlockHeightBoundNetworkController>(
    () =>
      new BlockHeightBoundNetworkController(network, {
        mantleEndpoints,
        mantleFetch,
        intervalMs,
      }),
  );

  const refetchBlockHeight = useCallback(() => {
    return controller.refetch();
  }, [controller]);

  useEffect(() => {
    controller.refetch(network);
  }, [controller, network]);

  useEffect(() => {
    const subscription = controller.states().subscribe({
      next: setStates,
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [controller]);

  return {
    ...states,
    refetchBlockHeight,
  };
}

export class BlockHeightBoundNetworkController {
  private _states: BehaviorSubject<{
    network: NetworkInfo;
    blockHeight: number;
  }>;

  private _network: NetworkInfo;

  private _invalid: boolean = false;

  private _timeoutId: number = 0;

  private _resolvers: Set<(blockHeight: number) => void> = new Set<
    (blockHeight: number) => void
  >();

  constructor(network: NetworkInfo, private props: Props) {
    this._network = network;

    this._states = new BehaviorSubject<{
      network: NetworkInfo;
      blockHeight: number;
    }>({
      network,
      blockHeight: -1,
    });

    this.refresh();
  }

  refetch = (nextNetwork?: NetworkInfo) => {
    if (nextNetwork) {
      this._network = nextNetwork;
    }

    this.refresh();

    return new Promise<number>((resolve) => {
      this._resolvers.add(resolve);
    });
  };

  states = () => {
    return this._states.asObservable();
  };

  destroy = () => {
    clearTimeout(this._timeoutId);
    this._resolvers.clear();
  };

  private refresh = () => {
    if (this._invalid) {
      return;
    }

    clearTimeout(this._timeoutId);

    this._invalid = true;

    setTimeout(() => {
      this.props
        .mantleFetch<{}, Data>(
          query,
          {},
          this.props.mantleEndpoints[this._network.name],
          {},
        )
        .then(({ LastSyncedHeight }) => {
          this._states.next({
            network: this._network,
            blockHeight: LastSyncedHeight,
          });

          if (this._resolvers.size > 0) {
            for (const resolve of this._resolvers) {
              resolve(LastSyncedHeight);
            }

            this._resolvers.clear();
          }

          this._invalid = false;

          this._timeoutId = (setTimeout(
            this.refresh,
            this.props.intervalMs,
          ) as unknown) as number;
        })
        .catch((error) => {
          console.error(error);

          this._invalid = false;

          setTimeout(this.refresh, 500);
        });
    }, 100);
  };
}
