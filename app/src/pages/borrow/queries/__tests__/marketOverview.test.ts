import { testAddressProvider, testClient } from 'test.env';
import {
  parseData,
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
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
          oracleContractAddress: testAddressProvider.oracle(),
          oracleQuery: {
            price: {
              base: testAddressProvider.bAssetToken('ubluna'),
              quote: 'uusd',
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
      .then(({ data }) => parseData(data, testAddressProvider));

    expect(!!data.borrowRate).toBeTruthy();
    expect(!!data.oraclePrice).toBeTruthy();
    expect(!!data.overseerWhitelist).toBeTruthy();
  });
});
