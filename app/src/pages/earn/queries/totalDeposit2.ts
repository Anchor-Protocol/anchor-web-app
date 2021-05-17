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
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useContractAddress } from 'base/contexts/contract';
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
}

export async function totalDeposit({
  mantleFetch,
  mantleEndpoint,
  variables,
  fetchBlockHeight,
}: TotalDepositParams): Promise<Data> {
  console.log('totalDeposit2.ts..totalDeposit()');

  variables.moneyMarketEpochQuery.epoch_state.block_height = await fetchBlockHeight();

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
  const { moneyMarket, cw20 } = useContractAddress();

  const userWallet = useConnectedWallet();

  const {
    blockHeight,
    refetchBlockHeight,
    mantleEndpoint,
    mantleFetch,
  } = useTerraWebapp();

  const result = useQuery(
    ['EARN_TOTAL_DEPOSIT', userWallet, mantleEndpoint],
    () =>
      totalDeposit({
        mantleEndpoint,
        mantleFetch,
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
      }),
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
