import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { uLuna } from '@anchor-protocol/notation';
import { createMap, map } from '@anchor-protocol/use-map';
import { ApolloClient, gql } from '@apollo/client';
import { parseResult } from 'queries/parseResult';
import { MappedApolloQueryResult } from 'queries/types';

export interface RawData {
  terraswapAskSimulation: {
    Result: string;
  };
}

export interface Data {
  terraswapAskSimulation: {
    Result: string;
    commission_amount: uLuna;
    return_amount: uLuna;
    spread_amount: uLuna;
  };
}

export const dataMap = createMap<RawData, Data>({
  terraswapAskSimulation: (existing, { terraswapAskSimulation }) => {
    return parseResult(
      existing.terraswapAskSimulation,
      terraswapAskSimulation.Result,
    );
  },
});

export interface RawVariables {
  bLunaTerraswap: string;
  askSimulationQuery: string;
}

export interface Variables {
  bLunaTerraswap: string;
  askSimulationQuery: {
    simulation: {
      offer_asset: {
        info: {
          native_token: {
            denom: 'uluna';
          };
        };
        amount: uLuna;
      };
    };
  };
}

export function mapVariables({
  bLunaTerraswap,
  askSimulationQuery,
}: Variables): RawVariables {
  return {
    bLunaTerraswap,
    askSimulationQuery: JSON.stringify(askSimulationQuery),
  };
}

export const query = gql`
  query($bLunaTerraswap: String!, $askSimulationQuery: String!) {
    terraswapAskSimulation: WasmContractsContractAddressStore(
      ContractAddress: $bLunaTerraswap
      QueryMsg: $askSimulationQuery
    ) {
      Result
    }
  }
`;

export function queryTerraswapAskSimulation(
  client: ApolloClient<any>,
  addressProvider: AddressProvider,
  getAmount: uLuna,
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        bLunaTerraswap: addressProvider.blunaBurnPair(),
        askSimulationQuery: {
          simulation: {
            offer_asset: {
              info: {
                native_token: {
                  denom: 'uluna',
                },
              },
              amount: getAmount,
            },
          },
        },
      }),
    })
    .then((result) => {
      return {
        ...result,
        data: map(result.data, dataMap),
      };
    });
}
