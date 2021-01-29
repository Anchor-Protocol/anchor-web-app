import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { min } from '@anchor-protocol/big-math';
import {
  bLuna,
  microfy,
  Ratio,
  ubLuna,
  uLuna,
  uUST,
} from '@anchor-protocol/notation';
import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  QueryResult,
  useQuery,
} from '@apollo/client';
import big, { Big } from 'big.js';
import { Bank, useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { Data as TaxData } from 'queries/tax';
import { useMemo } from 'react';

export interface StringifiedData {
  terraswapOfferSimulation: {
    Result: string;
  };
}

export interface Data {
  commission_amount: uLuna;
  return_amount: uLuna;
  spread_amount: uLuna;
  minimumReceived: uLuna;
  swapFee: uLuna;
}

export function parseData(
  { terraswapOfferSimulation }: StringifiedData,
  burnAmount: ubLuna,
  { taxRate, maxTaxUUSD }: TaxData,
): Data {
  const data = JSON.parse(terraswapOfferSimulation.Result) as Pick<
    Data,
    'commission_amount' | 'return_amount' | 'spread_amount'
  >;

  const beliefPrice = big(data.return_amount).div(burnAmount) as Ratio<Big>;
  const maxSpread = 0.1;

  const tax = min(
    big(burnAmount).mul(beliefPrice).mul(taxRate),
    maxTaxUUSD,
  ) as uUST<Big>;
  const expectedAmount = big(burnAmount).div(beliefPrice).minus(tax);
  const rate = big(1).minus(maxSpread);
  const minimumReceived = expectedAmount.mul(rate).toFixed() as uLuna;
  const swapFee = big(data.commission_amount)
    .plus(data.spread_amount)
    .toFixed() as uLuna;

  return {
    ...data,
    minimumReceived,
    swapFee,
  };
}

export interface StringifiedVariables {
  bLunaTerraswap: string;
  offerSimulationQuery: string;
}

export interface Variables {
  bLunaTerraswap: string;
  offerSimulationQuery: {
    simulation: {
      offer_asset: {
        info: {
          token: {
            contract_addr: string;
          };
        };
        amount: ubLuna;
      };
    };
  };
}

export function stringifyVariables({
  bLunaTerraswap,
  offerSimulationQuery,
}: Variables): StringifiedVariables {
  return {
    bLunaTerraswap,
    offerSimulationQuery: JSON.stringify(offerSimulationQuery),
  };
}

export const query = gql`
  query($bLunaTerraswap: String!, $offerSimulationQuery: String!) {
    terraswapOfferSimulation: WasmContractsContractAddressStore(
      ContractAddress: $bLunaTerraswap
      QueryMsg: $offerSimulationQuery
    ) {
      Result
    }
  }
`;

export function useTerraswapOfferSimulation({
  burnAmount,
}: {
  burnAmount: bLuna;
}): QueryResult<StringifiedData, StringifiedVariables> & {
  parsedData: Data | undefined;
} {
  const bank = useBank();
  const addressProvider = useAddressProvider();

  const amount =
    burnAmount.length > 0
      ? (microfy(burnAmount).toString() as ubLuna)
      : ('0' as ubLuna);

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    skip: amount === '0',
    fetchPolicy: 'network-only',
    variables: stringifyVariables({
      bLunaTerraswap: addressProvider.blunaBurnPair(),
      offerSimulationQuery: {
        simulation: {
          offer_asset: {
            info: {
              token: {
                contract_addr: addressProvider.bAssetToken('bluna'),
              },
            },
            amount,
          },
        },
      },
    }),
  });

  const parsedData = useMemo(
    () =>
      amount !== '0' && result.data
        ? parseData(result.data, amount, bank.tax)
        : undefined,
    [amount, bank.tax, result.data],
  );

  return {
    ...result,
    parsedData,
  };
}

export function queryTerraswapOfferSimulation(
  client: ApolloClient<any>,
  addressProvider: AddressProvider,
  burnAmount: ubLuna,
  bank: Bank,
): Promise<ApolloQueryResult<StringifiedData> & { parsedData: Data }> {
  return client
    .query<StringifiedData, StringifiedVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: stringifyVariables({
        bLunaTerraswap: addressProvider.blunaBurnPair(),
        offerSimulationQuery: {
          simulation: {
            offer_asset: {
              info: {
                token: {
                  contract_addr: addressProvider.bAssetToken('bluna'),
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
        parsedData: parseData(result.data, burnAmount, bank.tax),
      };
    });
}
