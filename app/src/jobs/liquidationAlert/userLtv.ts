import { ContractAddress, HumanAddr, uUST } from '@anchor-protocol/types';
import {
  borrowBorrowerQuery,
  borrowMarketQuery,
  computeCurrentLtv,
} from '@anchor-protocol/webapp-fns';
import { lastSyncedHeightQuery, MantleFetch } from '@packages/webapp-fns';

interface UserLtvQueryParams {
  mantleFetch: MantleFetch;
  mantleEndpoint: string;
  walletAddress: string;
  address: ContractAddress;
}

export async function userLtvQuery({
  walletAddress,
  mantleFetch,
  mantleEndpoint,
  address,
}: UserLtvQueryParams) {
  const [{ oraclePrices }, { marketBorrowerInfo, overseerCollaterals }] =
    await Promise.all([
      borrowMarketQuery({
        mantleEndpoint,
        mantleFetch,
        wasmQuery: {
          marketState: {
            contractAddress: address.moneyMarket.market,
            query: {
              state: {},
            },
          },
          overseerWhitelist: {
            contractAddress: address.moneyMarket.overseer,
            query: {
              whitelist: {
                collateral_token: address.cw20.bLuna,
              },
            },
          },
          borrowRate: {
            contractAddress: address.moneyMarket.interestModel,
            query: {
              borrow_rate: {
                market_balance: '0' as uUST,
                total_reserves: '0' as uUST,
                total_liabilities: '0' as uUST,
              },
            },
          },
          oraclePrices: {
            contractAddress: address.moneyMarket.oracle,
            query: {
              prices: {},
            },
          },
        },
      }),
      borrowBorrowerQuery({
        mantleEndpoint,
        mantleFetch,
        lastSyncedHeight: () =>
          lastSyncedHeightQuery({
            mantleEndpoint,
            mantleFetch,
          }),
        wasmQuery: {
          marketBorrowerInfo: {
            contractAddress: address.moneyMarket.market,
            query: {
              borrower_info: {
                borrower: walletAddress as HumanAddr,
                block_height: 0,
              },
            },
          },
          overseerCollaterals: {
            contractAddress: address.moneyMarket.overseer,
            query: {
              collaterals: {
                borrower: walletAddress as HumanAddr,
              },
            },
          },
          overseerBorrowLimit: {
            contractAddress: address.moneyMarket.overseer,
            query: {
              borrow_limit: {
                borrower: walletAddress as HumanAddr,
                block_time: -1,
              },
            },
          },
        },
      }),
    ]);

  return computeCurrentLtv(
    marketBorrowerInfo,
    overseerCollaterals,
    oraclePrices,
  );
}
