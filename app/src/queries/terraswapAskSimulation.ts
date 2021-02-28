import type {
  ContractAddress,
  Denom,
  HumanAddr,
  terraswap,
  uToken,
  WASMContractResult,
} from '@anchor-protocol/types';
import { createMap, map } from '@anchor-protocol/use-map';
import { ApolloClient, gql } from '@apollo/client';
import { parseResult } from 'queries/parseResult';
import { MappedApolloQueryResult } from 'queries/types';

export interface RawData {
  terraswapAskSimulation: WASMContractResult;
}

export interface Data {
  terraswapAskSimulation: WASMContractResult<
    terraswap.SimulationResponse<uToken>
  >;
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
  terraswapPair: string;
  askSimulationQuery: string;
}

export interface Variables {
  terraswapPair: string;
  askSimulationQuery: terraswap.Simulation<uToken>;
}

export function mapVariables({
  terraswapPair,
  askSimulationQuery,
}: Variables): RawVariables {
  return {
    terraswapPair,
    askSimulationQuery: JSON.stringify(askSimulationQuery),
  };
}

export const query = gql`
  query __terraswapAskSimulation(
    $terraswapPair: String!
    $askSimulationQuery: String!
  ) {
    terraswapAskSimulation: WasmContractsContractAddressStore(
      ContractAddress: $terraswapPair
      QueryMsg: $askSimulationQuery
    ) {
      Result
    }
  }
`;

export function queryTerraswapAskSimulation(
  client: ApolloClient<any>,
  address: ContractAddress,
  getAmount: uToken,
  terraswapPair: HumanAddr,
  denom: Denom,
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'no-cache',
      variables: mapVariables({
        terraswapPair,
        askSimulationQuery: {
          simulation: {
            offer_asset: {
              info: {
                native_token: { denom },
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
