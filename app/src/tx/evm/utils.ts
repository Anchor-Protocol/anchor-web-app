import { ANCHOR_TX_KEY } from '@anchor-protocol/app-provider';
import {
  CrossChainEvent,
  CrossChainEventKind,
} from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { EVM_QUERY_KEY, TxRefetchMap } from '@libs/app-provider';
import { ConnectType, EvmChainId } from '@libs/evm-wallet';
import { StreamReturn } from '@rx-stream/react';
import { ANCHOR_TX_REFETCH_MAP } from 'env';
import { ContractReceipt } from 'ethers';

export const TX_GAS_LIMIT = 255000;

export type UseTxReturn<T, V> =
  | StreamReturn<T, TxResultRendering<V>>
  | [null, null];

export const txResult = (
  event: CrossChainEvent<ContractReceipt>,
  connnectType: ConnectType,
  chainId: EvmChainId,
  txKind: TxKind,
) => {
  return {
    value: null,
    message: txResultMessage(event.kind, connnectType, chainId, txKind),
    phase: TxStreamPhase.BROADCAST,
    receipts: [
      //{ name: "Status", value: txResultMessage(event, connnectType, chainId, action) }
    ],
  };
};

export const txResultMessage = (
  eventKind: CrossChainEventKind,
  connnectType: ConnectType,
  chainId: EvmChainId,
  txKind: TxKind,
) => {
  switch (eventKind) {
    case CrossChainEventKind.CrossChainTxCompleted:
      return `Cross chain transaction completed.`;
    case CrossChainEventKind.RemoteChainTxRequested:
      return `${capitalize(formatTxKind(txKind))} requested. ${capitalize(
        connnectType,
      )} notification should appear soon...`;
    case CrossChainEventKind.RemoteChainTxExecuted:
      return `${capitalize(
        chain(chainId),
      )} transaction successful, waiting for Wormhole bridge...`;
    case CrossChainEventKind.RemoteChainVAAsRetrieved:
      return `Entering Wormhole bridge on ${capitalize(chain(chainId))}...`;
    case CrossChainEventKind.OutgoingSequenceRetrieved:
      return `Entering Terra, executing ${formatTxKind(txKind)} action...`;
    case CrossChainEventKind.TerraVAAsRetrieved:
      return `Terra action executed, exiting Wormhole bridge on Terra...`;
    case CrossChainEventKind.RemoteChainTxSubmitted:
      return `Waiting for ${formatTxKind(txKind)} transaction on ${capitalize(
        chain(chainId),
      )}...`;
    case CrossChainEventKind.RemoteChainApprovalRequested:
      return `Allowance requested. ${capitalize(
        connnectType,
      )} notification should appear soon...`;
    case CrossChainEventKind.RemoteChainApprovalSubmitted:
      return `Waiting for approval transaction on ${capitalize(
        chain(chainId),
      )}...`;
    case CrossChainEventKind.RemoteChainReturnTxRequested:
      return `Deposit requested. ${capitalize(
        connnectType,
      )} notification should appear soon...`;
    case CrossChainEventKind.RemoteChainReturnTxSubmitted:
      return `Waiting for finalize transaction on ${capitalize(
        chain(chainId),
      )}...`;
  }
};

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
  WithdrawAssets,
}

export const formatTxKind = (txKind: TxKind) => {
  switch (txKind) {
    case TxKind.WithdrawUst:
      return 'withdraw';
    case TxKind.RepayUst:
      return 'repay';
    case TxKind.RedeemCollateral:
      return 'redeem collateral';
    case TxKind.ProvideCollateral:
      return 'provide collateral';
    case TxKind.DepositUst:
      return 'deposit';
    case TxKind.ClaimRewards:
      return 'claim rewards';
    case TxKind.BorrowUst:
      return 'borrow';
    case TxKind.WithdrawAssets:
      return 'withdraw';
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
    case TxKind.WithdrawAssets:
      return ANCHOR_TX_KEY.EARN_WITHDRAW;
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
};

export const errorContains = (error: any, message: string) =>
  String(error?.data?.message ?? error?.message).includes(message);

export enum TxError {
  TxHashInvalid = 'invalid hash',
  TxAlreadyProcessed = 'execution reverted: transfer info already processed',
  TxInvalid = 'Transaction invalid. Action sequence missing.',
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
  }
};
