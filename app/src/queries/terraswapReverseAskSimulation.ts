import type {
  ContractAddress,
  CW20Addr,
  HumanAddr,
  terraswap,
  uToken,
  WASMContractResult,
} from '@anchor-protocol/types';
import { createMap, map } from '@anchor-protocol/use-map';
import { ApolloClient, gql } from '@apollo/client';
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
    if (!terraswapAskSimulation || !terraswapAskSimulation?.Result)
      return existing.terraswapAskSimulation;

    const { commission_amount, offer_amount, spread_amount } = JSON.parse(
      terraswapAskSimulation.Result,
    ) as terraswap.ReverseSimulationResponse<uToken>;

    return {
      ...terraswapAskSimulation,
      commission_amount,
      return_amount: offer_amount,
      spread_amount,
    } as WASMContractResult<terraswap.SimulationResponse<uToken>>;
  },
});

export interface RawVariables {
  terraswapPair: string;
  askSimulationQuery: string;
}

export interface Variables {
  terraswapPair: string;
  askSimulationQuery: terraswap.ReverseSimulation<uToken>;
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

export function queryTerraswapReverseAskSimulation(
  client: ApolloClient<any>,
  address: ContractAddress,
  getAmount: uToken,
  terraswapPair: HumanAddr,
  tokenAddr: CW20Addr,
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'no-cache',
      variables: mapVariables({
        terraswapPair,
        askSimulationQuery: {
          reverse_simulation: {
            ask_asset: {
              info: {
                token: {
                  contract_addr: tokenAddr,
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
