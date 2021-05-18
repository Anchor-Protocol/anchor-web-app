import type {
  cw20,
  CW20Addr,
  HumanAddr,
  moneyMarket,
  uaUST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { useAnchorContractAddress } from '@anchor-protocol/webapp-provider';
import { useEventBusListener } from '@terra-dev/event-bus';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery } from 'react-query';

export interface EarnTotalDepositRawData {
  aUSTBalance: WASMContractResult;
  exchangeRate: WASMContractResult;
}

export interface EarnTotalDepositData {
  aUSTBalance: WASMContractResult<cw20.BalanceResponse<uaUST>>;
  exchangeRate: WASMContractResult<moneyMarket.market.EpochStateResponse>;
}

export interface EarnTotalDepositRawVariables {
  anchorTokenContract: string;
  anchorTokenBalanceQuery: string;
  moneyMarketContract: string;
  moneyMarketEpochQuery: string;
}

export interface EarnTotalDepositVariables {
  anchorTokenContract: CW20Addr;
  anchorTokenBalanceQuery: cw20.Balance;
  moneyMarketContract: HumanAddr;
  moneyMarketEpochQuery: moneyMarket.market.EpochState;
}

// language=graphql
export const earnTotalDepositQuery = `
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

export interface EarnTotalDepositParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: EarnTotalDepositVariables;
  fetchBlockHeight: () => Promise<number>;
  blockHeight: number;
}

export async function earnTotalDeposit({
  mantleFetch,
  mantleEndpoint,
  variables,
}: EarnTotalDepositParams): Promise<EarnTotalDepositData> {
  const data = await mantleFetch<
    EarnTotalDepositRawVariables,
    EarnTotalDepositRawData
  >(
    earnTotalDepositQuery,
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

export function useEarnTotalDeposit() {
  const userWallet = useConnectedWallet();

  const {
    blockHeight,
    refetchBlockHeight,
    mantleEndpoint,
    mantleFetch,
    network,
  } = useTerraWebapp();

  const { moneyMarket, cw20 } = useAnchorContractAddress(network);

  const result = useQuery(
    [
      'EARN_TOTAL_DEPOSIT',
      userWallet?.walletAddress,
      network.name,
      mantleEndpoint,
    ],
    () => {
      return earnTotalDeposit({
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
