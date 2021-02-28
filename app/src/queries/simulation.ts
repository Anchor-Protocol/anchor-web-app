import type {
  ContractAddress,
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
  simulation: WASMContractResult;
}

export interface Data {
  simulation: WASMContractResult<terraswap.SimulationResponse<uToken>>;
}

export const dataMap = createMap<RawData, Data>({
  simulation: (existing, { simulation }) => {
    return parseResult(existing.simulation, simulation.Result);
  },
});

export interface RawVariables {
  terraswapPair: string;
  simulationQuery: string;
}

export interface Variables {
  terraswapPair: string;
  simulationQuery: terraswap.Simulation<uToken>;
}

export function mapVariables({
  terraswapPair,
  simulationQuery,
}: Variables): RawVariables {
  return {
    terraswapPair,
    simulationQuery: JSON.stringify(simulationQuery),
  };
}

export const query = gql`
  query __terraswapSimulation(
    $terraswapPair: String!
    $simulationQuery: String!
  ) {
    simulation: WasmContractsContractAddressStore(
      ContractAddress: $terraswapPair
      QueryMsg: $simulationQuery
    ) {
      Result
    }
  }
`;

export function querySimulation(
  client: ApolloClient<any>,
  address: ContractAddress,
  amount: uToken,
  terraswapPair: HumanAddr,
  simulationInfo: terraswap.SimulationInfo,
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'no-cache',
      variables: mapVariables({
        terraswapPair,
        simulationQuery: {
          simulation: {
            offer_asset: {
              info: simulationInfo,
              amount,
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
