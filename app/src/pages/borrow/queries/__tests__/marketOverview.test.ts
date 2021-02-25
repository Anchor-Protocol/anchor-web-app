import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient } from 'test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../marketOverview';
import { getMarketState } from './marketState.test';

describe('queries/marketOverview', () => {
  test('should get result from query', async () => {
    const { marketBalance, marketState } = await getMarketState();

    if (!marketBalance || !marketState) {
      throw new Error('Undefined marketBalance!');
    }

    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          interestContractAddress: testAddressProvider.interest(),
          interestBorrowRateQuery: {
            borrow_rate: {
              market_balance:
                marketBalance.find(({ Denom }) => Denom === 'uusd')?.Amount ??
                '',
              total_liabilities: marketState.total_liabilities ?? '',
              total_reserves: marketState.total_reserves ?? '',
            },
          },
          oracleContractAddress: testAddressProvider.oracle(),
          oracleQuery: {
            price: {
              base: testAddressProvider.blunaToken(),
              quote: 'uusd',
            },
          },
          overseerContractAddress: testAddressProvider.overseer(),
          overseerWhitelistQuery: {
            whitelist: {
              collateral_token: testAddressProvider.blunaToken(),
            },
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(data.borrowRate).not.toBeUndefined();
    expect(data.oraclePrice).not.toBeUndefined();
    expect(data.overseerWhitelist).not.toBeUndefined();
  });
});
