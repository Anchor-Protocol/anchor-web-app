import { testAddressProvider, testClient, testWalletAddress } from 'test.env';
import {
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
  parseData,
} from '../marketOverview';
import { getMarketBalance } from './marketBalanceOverview.test';

describe('queries/marketOverview', () => {
  test('should get result from query', async () => {
    const marketBalance = await getMarketBalance();

    if (!marketBalance) {
      throw new Error('Undefined marketBalance!');
    }

    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
          interestContractAddress: testAddressProvider.interest(),
          interestBorrowRateQuery: {
            borrow_rate: {
              market_balance:
                marketBalance.marketBalance.find(
                  ({ Denom }) => Denom === 'uusd',
                )?.Amount ?? '',
              total_liabilities:
                marketBalance.marketState.total_liabilities ?? '',
              total_reserves: marketBalance.marketState.total_reserves ?? '',
            },
          },
          marketContractAddress: testAddressProvider.market('uusd'),
          marketLoanQuery: {
            loan_amount: {
              borrower: testWalletAddress,
              block_height: marketBalance.currentBlock ?? 0,
            },
          },
          oracleContractAddress: testAddressProvider.oracle(),
          oracleQuery: {
            price: {
              base: testAddressProvider.bAssetToken('ubluna'),
              quote: 'uusd',
            },
          },
          custodyContractAddress: testAddressProvider.custody(),
          custodyBorrowerQuery: {
            borrower: {
              address: testWalletAddress,
            },
          },
          overseerContractAddress: testAddressProvider.overseer(),
          overseerWhitelistQuery: {
            whitelist: {
              collateral_token: testAddressProvider.bAssetToken('ubluna'),
            },
          },
        }),
      })
      .then(({ data }) => parseData(data));

    expect(!!data.borrowRate).toBeTruthy();
    expect(!!data.loanAmount).toBeTruthy();
    expect(!!data.oraclePrice).toBeTruthy();
    expect(!!data.borrowInfo).toBeTruthy();
    expect(!!data.overseerWhitelist).toBeTruthy();
  });
});
