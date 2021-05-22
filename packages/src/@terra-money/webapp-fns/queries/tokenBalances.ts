import { MantleFetch } from '../types';

export interface CW20Contract {
  contractAddress: string;
}

export interface TokenBalancesRawData {
  nativeTokenBalances: {
    Result: { Denom: string; Amount: string }[];
  };

  [key: string]: {
    Result: { Denom: string; Amount: string }[] | string;
  };
}

export type TokenBalancesData = Record<string, string>;

export const TOKEN_BALANCES_QUERY = (
  walletAddress: string,
  cw20TokenContracts: [string, string][],
) => {
  const cw20Query = cw20TokenContracts
    .map(
      ([tokenKey, contractAddress]) => `
      ${tokenKey}: WasmContractsContractAddressStore(
        ContractAddress: "${contractAddress}"
        QueryMsg: "{\\"balance\\": {\\"address\\": \\"${walletAddress}\\"}}"
      ) {
        Result
      }
      `,
    )
    .join('\n');

  return `
    query {
      nativeTokenBalances: BankBalancesAddress(Address: "${walletAddress}") {
        Result {
          Denom
          Amount
        }
      }
      
      ${cw20Query}
    }
  `;
};

class TokenBalancesFetcher {
  private resolvers = new Set<
    [(tokenBalances: TokenBalancesData) => void, (error: unknown) => void]
  >();
  private fetched: boolean = false;
  private failedCount: number = 0;

  private nativeTokenKeys: Map<string, string>;
  private readonly cw20TokenContracts: [string, string][];

  constructor(
    private mantleEndpoint: string,
    private mantleFetch: MantleFetch,
    nativeTokenKeys: Record<string, string>,
    cw20TokenContracts: Record<string, CW20Contract>,
  ) {
    this.nativeTokenKeys = new Map();

    Object.keys(nativeTokenKeys).forEach((nativeTokenKey) => {
      this.nativeTokenKeys.set(nativeTokenKeys[nativeTokenKey], nativeTokenKey);
    });

    this.cw20TokenContracts = Object.keys(cw20TokenContracts).reduce(
      (arr, tokenKey) => {
        arr.push([tokenKey, cw20TokenContracts[tokenKey].contractAddress]);
        return arr;
      },
      [] as [string, string][],
    );
  }

  fetchTokenBalances = (walletAddress: string) => {
    return new Promise<TokenBalancesData>((resolve, reject) => {
      this.resolvers.add([resolve, reject]);
      this.fetch(walletAddress);
    });
  };

  private fetch = (walletAddress: string) => {
    if (this.fetched) {
      return;
    }

    this.fetched = true;

    const query = TOKEN_BALANCES_QUERY(walletAddress, this.cw20TokenContracts);

    this.mantleFetch<{}, TokenBalancesRawData>(
      query,
      {},
      this.mantleEndpoint + '?token-balances',
    )
      .then((rawData) => {
        const { nativeTokenBalances, ...cw20TokenBalances } = rawData;
        const data: TokenBalancesData = {};

        for (const { Denom, Amount } of nativeTokenBalances.Result) {
          const key = this.nativeTokenKeys.get(Denom);

          if (key) {
            data[key] = Amount;
          }
        }

        Object.keys(cw20TokenBalances).forEach((cw20TokenKey) => {
          const result = cw20TokenBalances[cw20TokenKey].Result;

          if (typeof result === 'string') {
            const { balance }: { balance: string } = JSON.parse(result);

            data[cw20TokenKey] = balance;
          }
        });

        for (const [resolve] of this.resolvers) {
          resolve(data);
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
            this.fetch(walletAddress);
          }, 100);
        }
      });
  };
}

const fetchers: Map<string, TokenBalancesFetcher> = new Map<
  string,
  TokenBalancesFetcher
>();

interface TokenBalancesQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  nativeTokenKeys: Record<string, string>;
  cw20TokenContracts: Record<string, CW20Contract>;
  walletAddress: string;
}

export function tokenBalancesQuery<T = TokenBalancesData>({
  mantleEndpoint,
  mantleFetch,
  nativeTokenKeys,
  cw20TokenContracts,
  walletAddress,
}: TokenBalancesQueryParams): Promise<T> {
  if (!fetchers.has(mantleEndpoint)) {
    fetchers.set(
      mantleEndpoint,
      new TokenBalancesFetcher(
        mantleEndpoint,
        mantleFetch,
        nativeTokenKeys,
        cw20TokenContracts,
      ),
    );
  }

  return (fetchers
    .get(mantleEndpoint)!
    .fetchTokenBalances(walletAddress) as Promise<unknown>) as Promise<T>;
}
