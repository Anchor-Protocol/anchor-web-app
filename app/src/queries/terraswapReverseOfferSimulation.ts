import type {
  ContractAddress,
  HumanAddr,
  terraswap,
  uToken,
  WASMContractResult,
} from '@anchor-protocol/types';
import { Denom } from '@anchor-protocol/types';
import { createMap, map } from '@anchor-protocol/use-map';
import { ApolloClient, gql } from '@apollo/client';
import { MappedApolloQueryResult } from 'queries/types';

export interface RawData {
  terraswapOfferSimulation: WASMContractResult;
}

export interface Data {
  terraswapOfferSimulation: WASMContractResult<
    terraswap.SimulationResponse<uToken>
  >;
}

export const dataMap = createMap<RawData, Data>({
  terraswapOfferSimulation: (existing, { terraswapOfferSimulation }) => {
    if (!terraswapOfferSimulation || !terraswapOfferSimulation?.Result)
      return existing.terraswapOfferSimulation;

    const { commission_amount, offer_amount, spread_amount } = JSON.parse(
      terraswapOfferSimulation.Result,
    ) as terraswap.ReverseSimulationResponse<uToken>;

    return {
      ...terraswapOfferSimulation,
      commission_amount,
      return_amount: offer_amount,
      spread_amount,
    } as WASMContractResult<terraswap.SimulationResponse<uToken>>;
  },
});

export interface RawVariables {
  terraswapPair: string;
  offerSimulationQuery: string;
}

export interface Variables {
  terraswapPair: string;
  offerSimulationQuery: terraswap.ReverseSimulation<uToken>;
}

export function mapVariables({
  terraswapPair,
  offerSimulationQuery,
}: Variables): RawVariables {
  return {
    terraswapPair,
    offerSimulationQuery: JSON.stringify(offerSimulationQuery),
  };
}

export const query = gql`
  query __terraswapReverseOfferSimulation(
    $terraswapPair: String!
    $offerSimulationQuery: String!
  ) {
    terraswapOfferSimulation: WasmContractsContractAddressStore(
      ContractAddress: $terraswapPair
      QueryMsg: $offerSimulationQuery
    ) {
      Result
    }
  }
`;

export function queryTerraswapReverseOfferSimulation(
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
        offerSimulationQuery: {
          reverse_simulation: {
            ask_asset: {
              info: {
                native_token: {
                  denom,
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
