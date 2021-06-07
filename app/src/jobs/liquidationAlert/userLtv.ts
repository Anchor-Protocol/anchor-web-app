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
        variables: {
          oracleContract: address.moneyMarket.oracle,
          overseerContract: address.moneyMarket.overseer,
          interestContract: address.moneyMarket.interestModel,
          marketContract: address.moneyMarket.market,
          marketStateQuery: {
            state: {},
          },
          oracleQuery: {
            price: {
              base: address.cw20.bLuna,
              quote: 'uusd' as StableDenom,
            },
          },
          overseerWhitelistQuery: {
            whitelist: {
              collateral_token: address.cw20.bLuna,
            },
          },
          interestBorrowRateQuery: {
            borrow_rate: {
              market_balance: '' as uUST,
              total_reserves: '' as uUST,
              total_liabilities: '' as uUST,
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
        variables: {
          marketContract: address.moneyMarket.market,
          custodyContract: address.moneyMarket.custody,
          custodyBorrowerQuery: {
            borrower: {
              address: walletAddress as HumanAddr,
            },
          },
          marketBorrowerInfoQuery: {
            borrower_info: {
              borrower: walletAddress as HumanAddr,
              block_height: 0,
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
