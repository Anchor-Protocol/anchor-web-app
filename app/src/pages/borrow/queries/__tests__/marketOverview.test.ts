import { StableDenom } from '@anchor-protocol/types';
import { map } from '@terra-dev/use-map';
import { testAddress, testClient } from 'base/test.env';
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
          interestContractAddress: testAddress.moneyMarket.interestModel,
          interestBorrowRateQuery: {
            borrow_rate: {
              market_balance: marketBalance.find(
                ({ Denom }) => Denom === 'uusd',
              )!.Amount,
              total_liabilities: marketState.total_liabilities,
              total_reserves: marketState.total_reserves,
            },
          },
          oracleContractAddress: testAddress.moneyMarket.oracle,
          oracleQuery: {
            price: {
              base: testAddress.cw20.bLuna,
              quote: 'uusd' as StableDenom,
            },
          },
          overseerContractAddress: testAddress.moneyMarket.overseer,
          overseerWhitelistQuery: {
            whitelist: {
              collateral_token: testAddress.cw20.bLuna,
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
