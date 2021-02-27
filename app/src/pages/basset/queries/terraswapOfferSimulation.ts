import type { ubLuna, uLuna } from '@anchor-protocol/types';
import {
  ContractAddress,
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
    terraswap.SimulationResponse<uLuna>
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
  bLunaTerraswap: string;
  offerSimulationQuery: string;
}

export interface Variables {
  bLunaTerraswap: string;
  offerSimulationQuery: terraswap.Simulation<ubLuna>;
}

export function mapVariables({
  bLunaTerraswap,
  offerSimulationQuery,
}: Variables): RawVariables {
  return {
    bLunaTerraswap,
    offerSimulationQuery: JSON.stringify(offerSimulationQuery),
  };
}

export const query = gql`
  query __terraswapOfferSimulation(
    $bLunaTerraswap: String!
    $offerSimulationQuery: String!
  ) {
    terraswapOfferSimulation: WasmContractsContractAddressStore(
      ContractAddress: $bLunaTerraswap
      QueryMsg: $offerSimulationQuery
    ) {
      Result
    }
  }
`;

export function queryTerraswapOfferSimulation(
  client: ApolloClient<any>,
  address: ContractAddress,
  burnAmount: ubLuna,
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'no-cache',
      variables: mapVariables({
        bLunaTerraswap: address.terraswap.blunaLunaPair,
        offerSimulationQuery: {
          simulation: {
            offer_asset: {
              info: {
                token: {
                  contract_addr: address.cw20.bLuna,
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
