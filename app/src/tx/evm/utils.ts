import { ANCHOR_TX_KEY } from '@anchor-protocol/app-provider';
import { EvmChainId } from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering } from '@libs/app-fns';
import { EVM_QUERY_KEY, TxRefetchMap } from '@libs/app-provider';
import { StreamReturn } from '@rx-stream/react';
import { ANCHOR_TX_REFETCH_MAP } from 'env';

export type UseTxReturn<T, V> =
  | StreamReturn<T, TxResultRendering<V>>
  | [null, null];

export const capitalize = (word: string) => {
  const str = word.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const chain = (chainId: EvmChainId) => {
  switch (chainId) {
    case EvmChainId.AVALANCHE:
    case EvmChainId.AVALANCHE_FUJI_TESTNET:
      return 'Avalanche';
    default:
      return 'Ethereum';
  }
};

export const pluralize = <T>(word: string, arr: T[]) => {
  if (arr.length === 0) {
    return null;
  }

  if (arr.length === 1) {
    return word;
  }

  return word + 's';
};

export enum TxKind {
  WithdrawUst,
  RepayUst,
  RedeemCollateral,
  ProvideCollateral,
  DepositUst,
  ClaimRewards,
  BorrowUst,
  WithdrawAsset,
  ProvideAndBorrow,
  ExtendAncLockPeriod,
  WithdrawAnc,
  LockAnc,
}

export const formatTxKind = (txKind: TxKind) => {
  switch (txKind) {
    case TxKind.WithdrawUst:
      return 'Withdraw';
    case TxKind.RepayUst:
      return 'Repay';
    case TxKind.RedeemCollateral:
      return 'Redeem Collateral';
    case TxKind.ProvideCollateral:
      return 'Provide Collateral';
    case TxKind.DepositUst:
      return 'Deposit';
    case TxKind.ClaimRewards:
      return 'Claim Rewards';
    case TxKind.BorrowUst:
      return 'Borrow';
    case TxKind.WithdrawAsset:
      return 'Withdraw';
    case TxKind.ProvideAndBorrow:
      return 'Borrow';
    case TxKind.ExtendAncLockPeriod:
      return 'Extend lock period';
    case TxKind.WithdrawAnc:
      return 'Unstake';
    case TxKind.LockAnc:
      return 'Stake';
  }
};

export const refetchQueryByTxKind = (txKind: TxKind): ANCHOR_TX_KEY => {
  switch (txKind) {
    case TxKind.WithdrawUst:
      return ANCHOR_TX_KEY.EARN_WITHDRAW;
    case TxKind.RepayUst:
      return ANCHOR_TX_KEY.BORROW_REPAY;
    case TxKind.RedeemCollateral:
      return ANCHOR_TX_KEY.BORROW_REDEEM_COLLATERAL;
    case TxKind.ProvideCollateral:
      return ANCHOR_TX_KEY.BORROW_PROVIDE_COLLATERAL;
    case TxKind.DepositUst:
      return ANCHOR_TX_KEY.EARN_DEPOSIT;
    case TxKind.ClaimRewards:
      return ANCHOR_TX_KEY.REWARDS_ALL_CLAIM;
    case TxKind.BorrowUst:
      return ANCHOR_TX_KEY.BORROW_BORROW;
    case TxKind.WithdrawAsset:
      return ANCHOR_TX_KEY.EARN_WITHDRAW;
    case TxKind.ProvideAndBorrow:
      return ANCHOR_TX_KEY.BORROW_PROVIDE_COLLATERAL;
    case TxKind.ExtendAncLockPeriod:
      return ANCHOR_TX_KEY.EXTEND_LOCK_PERIOD;
    case TxKind.WithdrawAnc:
      return ANCHOR_TX_KEY.ANC_GOVERNANCE_UNSTAKE;
    case TxKind.LockAnc:
      return ANCHOR_TX_KEY.LOCK_ANC;
  }
};

export const EVM_ANCHOR_TX_REFETCH_MAP: TxRefetchMap = {
  ...ANCHOR_TX_REFETCH_MAP,
  [ANCHOR_TX_KEY.EARN_WITHDRAW]: [
    ...ANCHOR_TX_REFETCH_MAP[ANCHOR_TX_KEY.EARN_WITHDRAW],
    EVM_QUERY_KEY.ERC20_BALANCE,
    EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
  ],
  [ANCHOR_TX_KEY.BORROW_REPAY]: [
    ...ANCHOR_TX_REFETCH_MAP[ANCHOR_TX_KEY.BORROW_REPAY],
    EVM_QUERY_KEY.ERC20_BALANCE,
    EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
  ],
  [ANCHOR_TX_KEY.BORROW_REDEEM_COLLATERAL]: [
    ...ANCHOR_TX_REFETCH_MAP[ANCHOR_TX_KEY.BORROW_REDEEM_COLLATERAL],
    EVM_QUERY_KEY.ERC20_BALANCE,
    EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
  ],
  [ANCHOR_TX_KEY.BORROW_PROVIDE_COLLATERAL]: [
    ...ANCHOR_TX_REFETCH_MAP[ANCHOR_TX_KEY.BORROW_PROVIDE_COLLATERAL],
    EVM_QUERY_KEY.ERC20_BALANCE,
    EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
  ],
  [ANCHOR_TX_KEY.EARN_DEPOSIT]: [
    ...ANCHOR_TX_REFETCH_MAP[ANCHOR_TX_KEY.EARN_DEPOSIT],
    EVM_QUERY_KEY.ERC20_BALANCE,
    EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
  ],
  [ANCHOR_TX_KEY.REWARDS_ALL_CLAIM]: [
    ...ANCHOR_TX_REFETCH_MAP[ANCHOR_TX_KEY.REWARDS_ALL_CLAIM],
    EVM_QUERY_KEY.ERC20_BALANCE,
    EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
  ],
  [ANCHOR_TX_KEY.BORROW_BORROW]: [
    ...ANCHOR_TX_REFETCH_MAP[ANCHOR_TX_KEY.BORROW_BORROW],
    EVM_QUERY_KEY.ERC20_BALANCE,
    EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
  ],
  [ANCHOR_TX_KEY.EARN_WITHDRAW]: [
    ...ANCHOR_TX_REFETCH_MAP[ANCHOR_TX_KEY.EARN_WITHDRAW],
    EVM_QUERY_KEY.ERC20_BALANCE,
    EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
  ],
  [ANCHOR_TX_KEY.EXTEND_LOCK_PERIOD]: [
    ...ANCHOR_TX_REFETCH_MAP[ANCHOR_TX_KEY.EXTEND_LOCK_PERIOD],
    EVM_QUERY_KEY.ERC20_BALANCE,
    EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
  ],
  [ANCHOR_TX_KEY.ANC_GOVERNANCE_UNSTAKE]: [
    ...ANCHOR_TX_REFETCH_MAP[ANCHOR_TX_KEY.ANC_GOVERNANCE_UNSTAKE],
    EVM_QUERY_KEY.ERC20_BALANCE,
    EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
  ],
  [ANCHOR_TX_KEY.LOCK_ANC]: [
    ...ANCHOR_TX_REFETCH_MAP[ANCHOR_TX_KEY.LOCK_ANC],
    EVM_QUERY_KEY.ERC20_BALANCE,
    EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
  ],
};

export const errorContains = (error: any, message: string) =>
  String(error?.data?.message ?? error?.message ?? error?.reason).includes(
    message,
  );

export enum TxError {
  TxHashInvalid = 'invalid hash',
  TxAlreadyProcessed = 'execution reverted: transfer info already processed',
  TxInvalid = 'Transaction invalid. Action sequence missing.',
  TxFailed = 'transaction failed',
}

export const formatError = (error: any, txError: TxError) => {
  if (errorContains(error, txError)) {
    return formatTxError(txError);
  }
};

const formatTxError = (txError: TxError) => {
  switch (txError) {
    case TxError.TxHashInvalid:
      return 'Transaction hash is invalid. Please confirm inputs are correct.';
    case TxError.TxAlreadyProcessed:
      return 'Transaction already processed.';
    case TxError.TxInvalid:
      return 'Not a valid xAnchor transaction (action sequence missing).';
    case TxError.TxFailed:
      return 'Transaction failed.';
  }
};
