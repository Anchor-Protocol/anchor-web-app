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

const STORAGE_KEY = (network: NetworkInfo) =>
  `__terra-${network.name}-latest-block-height__`;

export function useBlockHeightBoundNetwork({
  mantleEndpoints,
  mantleFetch,
  intervalMs = 1000 * 60 * 3,
}: Props): BlockHeightBoundNetwork {
  const { network } = useWallet();

  const [controller] = useState<BlockHeightBoundNetworkController>(
    () =>
      new BlockHeightBoundNetworkController(network, {
        mantleEndpoints,
        mantleFetch,
        intervalMs,
      }),
  );

  const [states, setStates] = useState<
    Omit<BlockHeightBoundNetwork, 'refetchBlockHeight'>
  >(() => ({
    network,
    blockHeight: controller.storageBlockHeight,
  }));

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

  private _inProgress: boolean = false;

  private _timeoutId: number = 0;

  private _ignoreBefore: number = Number.MAX_SAFE_INTEGER;

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
      blockHeight: this.storageBlockHeight,
    });

    this.refresh(Date.now());
  }

  get storageBlockHeight() {
    const storageBlockHeight = localStorage.getItem(STORAGE_KEY(this._network));
    return storageBlockHeight ? +storageBlockHeight : 0;
  }

  refetch = (nextNetwork?: NetworkInfo) => {
    const time = Date.now();

    if (nextNetwork) {
      this._network = nextNetwork;
      this._ignoreBefore = time;
      this._inProgress = false;
    }

    this.refresh(time);

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

  private refresh = (time: number) => {
    if (this._inProgress) {
      return;
    }

    clearTimeout(this._timeoutId);

    this._inProgress = true;

    this.props
      .mantleFetch<{}, Data>(
        query,
        {},
        this.props.mantleEndpoints[this._network.name],
        {},
      )
      .then(({ LastSyncedHeight }) => {
        if (time < this._ignoreBefore) {
          this._inProgress = false;
          this.refresh(Date.now());
          return;
        }

        if (this._resolvers.size > 0) {
          for (const resolve of this._resolvers) {
            resolve(LastSyncedHeight);
          }

          this._resolvers.clear();
        }

        this._states.next({
          network: this._network,
          blockHeight: LastSyncedHeight,
        });

        localStorage.setItem(
          STORAGE_KEY(this._network),
          LastSyncedHeight.toString(),
        );

        this._inProgress = false;

        this._timeoutId = (setTimeout(
          this.refresh,
          this.props.intervalMs,
        ) as unknown) as number;
      })
      .catch((error) => {
        console.error(error);

        this._inProgress = false;

        setTimeout(this.refresh, 500);
      });
  };
}
