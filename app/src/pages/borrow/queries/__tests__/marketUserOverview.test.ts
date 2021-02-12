import { map } from '@anchor-protocol/use-map';
import { testAddressProvider, testClient, testWalletAddress } from 'test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../marketUserOverview';
import { getMarketBalance } from './marketBalanceOverview.test';

describe('queries/marketUserOverview', () => {
  test('should get result from query', async () => {
    const marketBalance = await getMarketBalance();

    if (!marketBalance) {
      throw new Error('Undefined marketBalance!');
    }

    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          marketContractAddress: testAddressProvider.market('uusd'),
          marketLoanQuery: {
            loan_amount: {
              borrower: testWalletAddress,
              block_height: marketBalance.currentBlock ?? 0,
            },
          },
          custodyContractAddress: testAddressProvider.custody(),
          custodyBorrowerQuery: {
            borrower: {
              address: testWalletAddress,
            },
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(data.loanAmount).not.toBeUndefined();
    expect(data.borrowInfo).not.toBeUndefined();
    expect(data.liability).not.toBeUndefined();
  });
});
