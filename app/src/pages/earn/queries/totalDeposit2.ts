import type {
  cw20,
  CW20Addr,
  HumanAddr,
  moneyMarket,
  uaUST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { useEventBusListener } from '@terra-dev/event-bus';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  MantleFetch,
  useNetworkBoundValue,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { ADDRESSES } from 'base/env';
import { useQuery } from 'react-query';

export interface RawData {
  aUSTBalance: WASMContractResult;
  exchangeRate: WASMContractResult;
}

export interface Data {
  aUSTBalance: WASMContractResult<cw20.BalanceResponse<uaUST>>;
  exchangeRate: WASMContractResult<moneyMarket.market.EpochStateResponse>;
}

export interface RawVariables {
  anchorTokenContract: string;
  anchorTokenBalanceQuery: string;
  moneyMarketContract: string;
  moneyMarketEpochQuery: string;
}

export interface Variables {
  anchorTokenContract: CW20Addr;
  anchorTokenBalanceQuery: cw20.Balance;
  moneyMarketContract: HumanAddr;
  moneyMarketEpochQuery: moneyMarket.market.EpochState;
}

// language=graphql
export const query = `
  query __totalDeposit(
    $anchorTokenContract: String!
    $anchorTokenBalanceQuery: String!
    $moneyMarketContract: String!
    $moneyMarketEpochQuery: String!
  ) {
    aUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $anchorTokenContract
      QueryMsg: $anchorTokenBalanceQuery
    ) {
      Result
    }

    exchangeRate: WasmContractsContractAddressStore(
      ContractAddress: $moneyMarketContract
      QueryMsg: $moneyMarketEpochQuery
    ) {
      Result
    }
  }
`;

interface TotalDepositParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: Variables;
  fetchBlockHeight: () => Promise<number>;
  blockHeight: number;
}

export async function totalDeposit({
  mantleFetch,
  mantleEndpoint,
  variables,
}: TotalDepositParams): Promise<Data> {
  const data = await mantleFetch<RawVariables, RawData>(
    query,
    {
      anchorTokenContract: variables.anchorTokenContract,
      anchorTokenBalanceQuery: JSON.stringify(
        variables.anchorTokenBalanceQuery,
      ),
      moneyMarketContract: variables.moneyMarketContract,
      moneyMarketEpochQuery: JSON.stringify(variables.moneyMarketEpochQuery),
    },
    mantleEndpoint + '?EARN_TOTAL_DEPOSIT',
  );

  return {
    aUSTBalance: JSON.parse(data.aUSTBalance.Result),
    exchangeRate: JSON.parse(data.exchangeRate.Result),
  };
}

export function useTotalDeposit() {
  const userWallet = useConnectedWallet();

  const {
    blockHeight,
    refetchBlockHeight,
    mantleEndpoint,
    mantleFetch,
    network,
  } = useTerraWebapp();

  const { moneyMarket, cw20 } = useNetworkBoundValue(network, ADDRESSES);

  const result = useQuery(
    [
      'EARN_TOTAL_DEPOSIT',
      userWallet?.walletAddress,
      network.name,
      mantleEndpoint,
    ],
    () => {
      return totalDeposit({
        mantleEndpoint,
        mantleFetch,
        blockHeight,
        fetchBlockHeight: refetchBlockHeight,
        variables: {
          anchorTokenContract: cw20.aUST,
          anchorTokenBalanceQuery: {
            balance: {
              address: userWallet!.walletAddress,
            },
          },
          moneyMarketContract: moneyMarket.market,
          moneyMarketEpochQuery: {
            epoch_state: {
              block_height: blockHeight,
            },
          },
        },
      });
    },
    {
      refetchInterval: 1000 * 60 * 3,
      enabled: blockHeight > 0 && !!userWallet,
      keepPreviousData: true,
    },
  );

  useEventBusListener('interest-earned-updated', () => {
    if (userWallet) {
      result.refetch();
    }
  });

  useEventBusListener('tx-completed', () => {
    if (userWallet) {
      result.refetch();
    }
  });

  return result;
}
