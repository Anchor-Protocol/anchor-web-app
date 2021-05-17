import { map } from '@terra-dev/use-map';
import { queryLastSyncedHeight } from 'base/queries/lastSyncedHeight';
import { testAddress, testClient, testWalletAddress } from 'base/test.env';
import {
  dataMap,
  mapVariables,
  query,
  RawData,
  RawVariables,
} from '../totalDeposit';

const gql = (strings: TemplateStringsArray): string => strings.join('\n');

const query3 = gql`
  query __totalDeposit(
    $anchorTokenContract: String!
    $anchorTokenBalanceQuery: String!
    $moneyMarketContract: String!
    $moneyMarketEpochQuery: String!
  ) {
    aUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $anchorTokenContract
      QueryMsg: $anchorTokenBalanceQuery
    ) {
      Result
    }

    exchangeRate: WasmContractsContractAddressStore(
      ContractAddress: $moneyMarketContract
      QueryMsg: $moneyMarketEpochQuery
    ) {
      Result
    }
  }
`;

describe('queries/totalDeposit', () => {
  test('should get result from query', async () => {
    const { data: lastSyncedHeight } = await queryLastSyncedHeight(testClient);

    const data = await testClient
      .query<RawData, RawVariables>({
        query,
        variables: mapVariables({
          anchorTokenContract: testAddress.cw20.aUST,
          anchorTokenBalanceQuery: {
            balance: {
              address: testWalletAddress,
            },
          },
          moneyMarketContract: testAddress.moneyMarket.market,
          moneyMarketEpochQuery: {
            epoch_state: {
              block_height: lastSyncedHeight,
            },
          },
        }),
      })
      .then(({ data }) => map(data, dataMap));

    expect(data.aUSTBalance).not.toBeUndefined();
    expect(data.exchangeRate).not.toBeUndefined();
  });

  test('should get result from query with fetch', async () => {
    const { data: lastSyncedHeight } = await queryLastSyncedHeight(testClient);

    const _data = await fetch('https://tequila-mantle.anchorprotocol.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query3,
        variables: mapVariables({
          anchorTokenContract: testAddress.cw20.aUST,
          anchorTokenBalanceQuery: {
            balance: {
              address: testWalletAddress,
            },
          },
          moneyMarketContract: testAddress.moneyMarket.market,
          moneyMarketEpochQuery: {
            epoch_state: {
              block_height: lastSyncedHeight,
            },
          },
        }),
      }),
      signal: new AbortController().signal,
    }).then((res) => res.json());

    const data = map(_data.data, dataMap);

    expect(data.aUSTBalance).not.toBeUndefined();
    expect(data.exchangeRate).not.toBeUndefined();
  });
});
