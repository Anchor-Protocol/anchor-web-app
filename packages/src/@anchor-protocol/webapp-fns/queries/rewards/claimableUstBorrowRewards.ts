import {
  cw20,
  CW20Addr,
  HumanAddr,
  moneyMarket,
  uANC,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface RewardsClaimableUstBorrowRewardsRawData {
  borrowerInfo: WASMContractResult;
  userANCBalance: WASMContractResult;
  marketState: WASMContractResult;
}

export interface RewardsClaimableUstBorrowRewardsData {
  borrowerInfo: moneyMarket.market.BorrowerInfoResponse;
  userANCBalance: cw20.BalanceResponse<uANC>;
  marketState: moneyMarket.market.StateResponse;
}

export interface RewardsClaimableUstBorrowRewardsRawVariables {
  marketContract: string;
  ancContract: string;
  borrowerInfoQuery: string;
  userAncBalanceQuery: string;
  marketStateQuery: string;
}

export interface RewardsClaimableUstBorrowRewardsVariables {
  marketContract: HumanAddr;
  ancContract: CW20Addr;
  borrowerInfoQuery: moneyMarket.market.BorrowerInfo;
  userAncBalanceQuery: cw20.Balance;
  marketStateQuery: moneyMarket.market.State;
}

// language=graphql
export const REWARDS_CLAIMABLE_UST_BORROW_REWARDS_QUERY = `
  query (
    $marketContract: String!
    $ancContract: String!
    $borrowerInfoQuery: String!
    $userAncBalanceQuery: String!
    $marketStateQuery: String!
  ) {
    borrowerInfo: WasmContractsContractAddressStore(
      ContractAddress: $marketContract
      QueryMsg: $borrowerInfoQuery
    ) {
      Result
    }

    userANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ancContract
      QueryMsg: $userAncBalanceQuery
    ) {
      Result
    }

    marketState: WasmContractsContractAddressStore(
      ContractAddress: $marketContract
      QueryMsg: $marketStateQuery
    ) {
      Result
    }
  }
`;

export interface RewardsClaimableUstBorrowRewardsQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  lastSyncedHeight: () => Promise<number>;
  variables: RewardsClaimableUstBorrowRewardsVariables;
}

export async function rewardsClaimableUstBorrowRewardsQuery({
  mantleEndpoint,
  mantleFetch,
  lastSyncedHeight,
  variables,
}: RewardsClaimableUstBorrowRewardsQueryParams): Promise<RewardsClaimableUstBorrowRewardsData> {
  const blockHeight = await lastSyncedHeight();

  variables.borrowerInfoQuery.borrower_info.block_height = blockHeight + 1;

  const rawData = await mantleFetch<
    RewardsClaimableUstBorrowRewardsRawVariables,
    RewardsClaimableUstBorrowRewardsRawData
  >(
    REWARDS_CLAIMABLE_UST_BORROW_REWARDS_QUERY,
    {
      marketContract: variables.marketContract,
      ancContract: variables.ancContract,
      borrowerInfoQuery: JSON.stringify(variables.borrowerInfoQuery),
      userAncBalanceQuery: JSON.stringify(variables.userAncBalanceQuery),
      marketStateQuery: JSON.stringify(variables.marketStateQuery),
    },
    `${mantleEndpoint}?rewards--claimable-ust-borrow-rewards`,
  );

  return {
    borrowerInfo: JSON.parse(rawData.borrowerInfo.Result),
    userANCBalance: JSON.parse(rawData.userANCBalance.Result),
    marketState: JSON.parse(rawData.marketState.Result),
  };
}
