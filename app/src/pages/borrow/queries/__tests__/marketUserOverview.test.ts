import { testAddressProvider, testClient, testWalletAddress } from 'test.env';
import {
  query,
  StringifiedData,
  StringifiedVariables,
  stringifyVariables,
  parseData,
} from '../marketUserOverview';
import { getMarketBalance } from './marketBalanceOverview.test';

describe('queries/marketUserOverview', () => {
  test('should get result from query', async () => {
    const marketBalance = await getMarketBalance();

    if (!marketBalance) {
      throw new Error('Undefined marketBalance!');
    }

    const data = await testClient
      .query<StringifiedData, StringifiedVariables>({
        query,
        variables: stringifyVariables({
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
      .then(({ data }) => parseData(data));

    expect(!!data.loanAmount).toBeTruthy();
    expect(!!data.borrowInfo).toBeTruthy();
  });
});
