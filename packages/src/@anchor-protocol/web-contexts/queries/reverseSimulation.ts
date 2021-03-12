import type {
  ContractAddress,
  HumanAddr,
  terraswap,
  uToken,
  WASMContractResult,
} from '@anchor-protocol/types';
import { createMap, map } from '@terra-dev/use-map';
import { ApolloClient, gql } from '@apollo/client';
import { MappedApolloQueryResult } from '../queries/types';

export interface RawData {
  simulation: WASMContractResult;
}

export interface Data {
  simulation: WASMContractResult<terraswap.SimulationResponse<uToken>>;
}

export const dataMap = createMap<RawData, Data>({
  simulation: (existing, { simulation }) => {
    if (!simulation || !simulation?.Result) return existing.simulation;

    const { commission_amount, offer_amount, spread_amount } = JSON.parse(
      simulation.Result,
    ) as terraswap.ReverseSimulationResponse<uToken>;

    return {
      ...simulation,
      commission_amount,
      return_amount: offer_amount,
      spread_amount,
    } as WASMContractResult<terraswap.SimulationResponse<uToken>>;
  },
});

export interface RawVariables {
  terraswapPair: string;
  simulationQuery: string;
}

export interface Variables {
  terraswapPair: string;
  simulationQuery: terraswap.ReverseSimulation<uToken>;
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
  query __terraswapReverseSimulation(
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

export function queryReverseSimulation(
  client: ApolloClient<any>,
  address: ContractAddress,
  amount: uToken,
  terraswapPair: HumanAddr,
  simulationInfo: terraswap.ReverseSimulationInfo,
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'no-cache',
      variables: mapVariables({
        terraswapPair,
        simulationQuery: {
          reverse_simulation: {
            ask_asset: {
              info: simulationInfo,
              amount: amount,
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
