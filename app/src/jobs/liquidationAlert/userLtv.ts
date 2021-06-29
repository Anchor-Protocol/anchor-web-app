import {
  ContractAddress,
  HumanAddr,
  StableDenom,
  uUST,
} from '@anchor-protocol/types';
import {
  borrowBorrowerQuery,
  borrowMarketQuery,
} from '@anchor-protocol/webapp-fns';
import { lastSyncedHeightQuery, MantleFetch } from '@terra-money/webapp-fns';
import big from 'big.js';

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
  const [{ oraclePrice }, { marketBorrowerInfo, custodyBorrower }] =
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
          oraclePrice: {
            contractAddress: address.moneyMarket.oracle,
            query: {
              price: {
                base: address.cw20.bLuna,
                quote: 'uusd' as StableDenom,
              },
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
          custodyBorrower: {
            contractAddress: address.moneyMarket.custody,
            query: {
              borrower: {
                address: walletAddress as HumanAddr,
              },
            },
          },
        },
      }),
    ]);

  return big(marketBorrowerInfo.loan_amount)
    .div(
      big(big(custodyBorrower.balance).minus(custodyBorrower.spendable)).mul(
        oraclePrice.rate,
      ),
    )
    .toFixed();
}
