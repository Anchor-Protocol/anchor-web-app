import type { CW20Addr, uToken } from '@anchor-protocol/types';
import {
  ContractAddress,
  HumanAddr,
  terraswap,
  WASMContractResult,
} from '@anchor-protocol/types';
import { createMap, map } from '@anchor-protocol/use-map';
import { ApolloClient, gql } from '@apollo/client';
import { parseResult } from 'queries/parseResult';
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
    return parseResult(
      existing.terraswapOfferSimulation,
      terraswapOfferSimulation.Result,
    );
  },
});

export interface RawVariables {
  terraswapPair: string;
  offerSimulationQuery: string;
}

export interface Variables {
  terraswapPair: string;
  offerSimulationQuery: terraswap.Simulation<uToken>;
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
  query __terraswapOfferSimulation(
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

export function queryTerraswapOfferSimulation(
  client: ApolloClient<any>,
  address: ContractAddress,
  burnAmount: uToken,
  terraswapPair: HumanAddr,
  cw20Token: CW20Addr,
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'no-cache',
      variables: mapVariables({
        terraswapPair,
        offerSimulationQuery: {
          simulation: {
            offer_asset: {
              info: {
                token: {
                  contract_addr: cw20Token,
                },
              },
              amount: burnAmount,
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
