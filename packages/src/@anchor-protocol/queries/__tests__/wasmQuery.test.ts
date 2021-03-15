import { cw20, CW20Addr, HumanAddr, uaUST } from '@anchor-protocol/types';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { wasmQuery } from '../wasmQuery';

describe('wasmQuery', () => {
  const testClient = new ApolloClient({
    uri: 'https://tequila-mantle.anchorprotocol.com',
    //uri: 'https://tequila-mantle.terra.dev',
    cache: new InMemoryCache(),
  });

  test('should get result', async () => {
    const { data: balance } = await wasmQuery<
      cw20.Balance,
      cw20.BalanceResponse<uaUST>
    >(testClient, {
      id: 'test_balance',
      address: 'terra1ajt556dpzvjwl0kl5tzku3fc3p3knkg9mkv8jl' as CW20Addr,
      query: {
        balance: {
          address: 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9' as HumanAddr,
        },
      },
    });

    console.log('wasmQuery.test.ts..()', balance);
  });
});
