import { MantleFetch } from '@libs/mantle';

export interface TaxRawData {
  taxRate: {
    Height: string;
    Result: string;
  };

  [tokenKey: string]: {
    Height: string;
    Result: string;
  };
}

export interface TaxData {
  taxRate: string;

  [tokenKey: string]: string;
}

export const TAX_QUERY = (maxCapTokens: [string, string][]) => {
  const maxCapQuery = maxCapTokens
    .map(
      ([tokenKey, denom]) => `
      ${tokenKey}: TreasuryTaxCapDenom(Denom: "${denom}") {
        Height
        Result
      }
      `,
    )
    .join('\n');

  return `
    query {
      taxRate: TreasuryTaxRate {
        Height
        Result
      }
      
      ${maxCapQuery}
    }
  `;
};

class TaxFetcher {
  private resolvers = new Set<
    [(tax: TaxData) => void, (error: unknown) => void]
  >();
  private fetched: boolean = false;
  private failedCount: number = 0;

  private readonly maxCapTokenDenoms: [string, string][];

  constructor(
    private mantleEndpoint: string,
    private mantleFetch: MantleFetch,
    maxCapTokenDenoms: Record<string, string>,
  ) {
    this.maxCapTokenDenoms = Object.keys(maxCapTokenDenoms).reduce(
      (arr, tokenKey) => {
        arr.push([tokenKey, maxCapTokenDenoms[tokenKey]]);
        return arr;
      },
      [] as [string, string][],
    );
  }

  fetchTax = () => {
    return new Promise<TaxData>((resolve, reject) => {
      this.resolvers.add([resolve, reject]);
      this.fetch();
    });
  };

  private fetch = () => {
    if (this.fetched) {
      return;
    }

    this.fetched = true;

    const query = TAX_QUERY(this.maxCapTokenDenoms);

    this.mantleFetch<{}, TaxRawData>(query, {}, this.mantleEndpoint + '?tax')
      .then((rawData) => {
        const { taxRate, ...maxCapTaxes } = rawData;
        const data: TaxData = {
          taxRate: taxRate.Result,
        };

        Object.keys(maxCapTaxes).forEach((tokenKey) => {
          data[tokenKey] = maxCapTaxes[tokenKey].Result;
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
            this.fetch();
          }, 100);
        }
      });
  };
}

const fetchers: Map<string, TaxFetcher> = new Map<string, TaxFetcher>();

interface TaxQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  maxCapTokenDenoms: Record<string, string>;
}

export function taxQuery<T = TaxData>({
  mantleEndpoint,
  mantleFetch,
  maxCapTokenDenoms,
}: TaxQueryParams): Promise<T> {
  if (!fetchers.has(mantleEndpoint)) {
    fetchers.set(
      mantleEndpoint,
      new TaxFetcher(mantleEndpoint, mantleFetch, maxCapTokenDenoms),
    );
  }

  return fetchers
    .get(mantleEndpoint)!
    .fetchTax() as Promise<unknown> as Promise<T>;
}
