import { MantleFetch } from '../types';

// language=graphql
const LAST_SYNCED_HEIGHT_QUERY = `
  query {
    LastSyncedHeight
  }
`;

interface LastSyncedHeight {
  LastSyncedHeight: number;
}

class BlockHeightFetcher {
  private resolvers = new Set<(blockHeight: number) => void>();
  private fetched: boolean = false;

  constructor(
    private mantleEndpoint: string,
    private mantleFetch: MantleFetch,
  ) {}

  fetchBlockHeight = () => {
    return new Promise<number>((resolve) => {
      this.resolvers.add(resolve);
      this.fetch();
    });
  };

  private fetch = () => {
    if (this.fetched) {
      return;
    }

    this.fetched = true;

    this.mantleFetch<{}, LastSyncedHeight>(
      LAST_SYNCED_HEIGHT_QUERY,
      {},
      this.mantleEndpoint + '?last-synced-height',
    )
      .then(({ LastSyncedHeight }) => {
        for (const resolver of this.resolvers) {
          resolver(LastSyncedHeight);
        }
        this.resolvers.clear();
        this.fetched = false;
      })
      .catch((error) => {
        console.error(error);
        setTimeout(() => {
          this.fetched = false;
          this.fetch();
        }, 100);
      });
  };
}

const fetchers: Map<string, BlockHeightFetcher> = new Map<
  string,
  BlockHeightFetcher
>();

interface LastSyncedHeightQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
}

export function lastSyncedHeightQuery({
  mantleEndpoint,
  mantleFetch,
}: LastSyncedHeightQueryParams): Promise<number> {
  if (!fetchers.has(mantleEndpoint)) {
    fetchers.set(
      mantleEndpoint,
      new BlockHeightFetcher(mantleEndpoint, mantleFetch),
    );
  }

  return fetchers.get(mantleEndpoint)!.fetchBlockHeight();
}
