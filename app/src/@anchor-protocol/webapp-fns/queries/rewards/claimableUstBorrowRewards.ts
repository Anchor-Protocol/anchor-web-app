import { cw20, moneyMarket, uANC } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@packages/webapp-fns';

export interface RewardsClaimableUstBorrowRewardsWasmQuery {
  borrowerInfo: WasmQuery<
    moneyMarket.market.BorrowerInfo,
    moneyMarket.market.BorrowerInfoResponse
  >;
  userANCBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<uANC>>;
  marketState: WasmQuery<
    moneyMarket.market.State,
    moneyMarket.market.StateResponse
  >;
}

export type RewardsClaimableUstBorrowRewards =
  WasmQueryData<RewardsClaimableUstBorrowRewardsWasmQuery>;

export type RewardsClaimableUstBorrowRewardsQueryParams = Omit<
  MantleParams<RewardsClaimableUstBorrowRewardsWasmQuery>,
  'query' | 'variables'
> & {
  lastSyncedHeight: () => Promise<number>;
};

//export interface RewardsClaimableUstBorrowRewardsRawData {
//  borrowerInfo: WASMContractResult;
//  userANCBalance: WASMContractResult;
//  marketState: WASMContractResult;
//}
//
//export interface RewardsClaimableUstBorrowRewardsData {
//  borrowerInfo: moneyMarket.market.BorrowerInfoResponse;
//  userANCBalance: cw20.BalanceResponse<uANC>;
//  marketState: moneyMarket.market.StateResponse;
//}
//
//export interface RewardsClaimableUstBorrowRewardsRawVariables {
//  marketContract: string;
//  ancContract: string;
//  borrowerInfoQuery: string;
//  userAncBalanceQuery: string;
//  marketStateQuery: string;
//}
//
//export interface RewardsClaimableUstBorrowRewardsVariables {
//  marketContract: HumanAddr;
//  ancContract: CW20Addr;
//  borrowerInfoQuery: moneyMarket.market.BorrowerInfo;
//  userAncBalanceQuery: cw20.Balance;
//  marketStateQuery: moneyMarket.market.State;
//}
//
//// language=graphql
//export const REWARDS_CLAIMABLE_UST_BORROW_REWARDS_QUERY = `
//  query (
//    $marketContract: String!
//    $ancContract: String!
//    $borrowerInfoQuery: String!
//    $userAncBalanceQuery: String!
//    $marketStateQuery: String!
//  ) {
//    borrowerInfo: WasmContractsContractAddressStore(
//      ContractAddress: $marketContract
//      QueryMsg: $borrowerInfoQuery
//    ) {
//      Result
//    }
//
//    userANCBalance: WasmContractsContractAddressStore(
//      ContractAddress: $ancContract
//      QueryMsg: $userAncBalanceQuery
//    ) {
//      Result
//    }
//
//    marketState: WasmContractsContractAddressStore(
//      ContractAddress: $marketContract
//      QueryMsg: $marketStateQuery
//    ) {
//      Result
//    }
//  }
//`;
//
//export interface RewardsClaimableUstBorrowRewardsQueryParams {
//  mantleEndpoint: string;
//  mantleFetch: MantleFetch;
//  lastSyncedHeight: () => Promise<number>;
//  variables: RewardsClaimableUstBorrowRewardsVariables;
//}

export async function rewardsClaimableUstBorrowRewardsQuery({
  mantleEndpoint,
  wasmQuery,
  lastSyncedHeight,
  ...params
}: RewardsClaimableUstBorrowRewardsQueryParams): Promise<RewardsClaimableUstBorrowRewards> {
  const blockHeight = await lastSyncedHeight();

  wasmQuery.borrowerInfo.query.borrower_info.block_height = blockHeight + 1;

  return mantle<RewardsClaimableUstBorrowRewardsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?rewards--claimable-ust-borrow-rewards`,
    variables: {},
    wasmQuery,
    ...params,
  });

  //const rawData = await mantleFetch<
  //  RewardsClaimableUstBorrowRewardsRawVariables,
  //  RewardsClaimableUstBorrowRewardsRawData
  //>(
  //  REWARDS_CLAIMABLE_UST_BORROW_REWARDS_QUERY,
  //  {
  //    marketContract: variables.marketContract,
  //    ancContract: variables.ancContract,
  //    borrowerInfoQuery: JSON.stringify(variables.borrowerInfoQuery),
  //    userAncBalanceQuery: JSON.stringify(variables.userAncBalanceQuery),
  //    marketStateQuery: JSON.stringify(variables.marketStateQuery),
  //  },
  //  `${mantleEndpoint}?rewards--claimable-ust-borrow-rewards`,
  //);
  //
  //return {
  //  borrowerInfo: JSON.parse(rawData.borrowerInfo.Result),
  //  userANCBalance: JSON.parse(rawData.userANCBalance.Result),
  //  marketState: JSON.parse(rawData.marketState.Result),
  //};
}
