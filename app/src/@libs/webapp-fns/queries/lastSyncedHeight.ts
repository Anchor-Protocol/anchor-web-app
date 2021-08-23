import { MantleFetch } from '@libs/mantle';

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
  private resolvers = new Set<
    [(blockHeight: number) => void, (error: unknown) => void]
  >();
  private fetched: boolean = false;
  private failedCount: number = 0;

  constructor(
    private mantleEndpoint: string,
    private mantleFetch: MantleFetch,
  ) {}

  fetchBlockHeight = () => {
    return new Promise<number>((resolve, reject) => {
      this.resolvers.add([resolve, reject]);
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
        for (const [resolve] of this.resolvers) {
          resolve(LastSyncedHeight);
        }
        this.resolvers.clear();
        this.fetched = false;
        this.failedCount = 0;
      })
      .catch((error) => {
        if (this.failedCount > 4) {
          for (const [, reject] of this.resolvers) {
            reject(error);
          }
          this.resolvers.clear();
          this.fetched = false;
          this.failedCount = 0;
        } else {
          console.error(error);
          setTimeout(() => {
            this.fetched = false;
            this.failedCount += 1;
            this.fetch();
          }, 100);
        }
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
