import {
  CrossChainEvent,
  CrossChainEventKind,
} from '@anchor-protocol/crossanchor-sdk';
import { TxStreamPhase } from '@libs/app-fns';
import { ConnectType, EvmChainId } from '@libs/evm-wallet';
import { floor } from '@libs/big-math';
import big from 'big.js';

export const TX_GAS_LIMIT = 250000;

export const toWei = (str: string) => str;

export function formatInput(value: string): string {
  return floor(big(value)).toFixed();
}

export const txResult = (
  event: CrossChainEvent,
  connnectType: ConnectType,
  chainId: EvmChainId,
  action: string,
) => {
  return {
    value: null,
    message: txResultMessage(event, connnectType, chainId, action),
    phase: TxStreamPhase.BROADCAST,
    receipts: [],
  };
};

const txResultMessage = (
  event: CrossChainEvent,
  connnectType: ConnectType,
  chainId: EvmChainId,
  action: string,
) => {
  switch (event.kind) {
    case CrossChainEventKind.CrossChainTxCompleted:
      return `Cross chain transaction completed.`;
    case CrossChainEventKind.RemoteChainTxRequested:
      return `${capitalize(action)} requested. ${capitalize(
        connnectType,
      )} notification should appear soon...`;
    case CrossChainEventKind.RemoteChainTxExecuted:
      return `${capitalize(
        chain(chainId),
      )} transaction successful, waiting for Wormhole bridge...`;
    case CrossChainEventKind.RemoteChainWormholeEntered:
      return `Entering Wormhole bridge on ${capitalize(chain(chainId))}...`;
    case CrossChainEventKind.TerraWormholeEntered:
      return `Entering Terra, executing ${action} action...`;
    case CrossChainEventKind.TerraWormholeExited:
      return `Terra action executed, exiting Wormhole bridge on Terra...`;
    case CrossChainEventKind.RemoteChainTxSubmitted:
      return `Waiting for ${action} transaction on ${capitalize(
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
      return `${capitalize(action)} requested. ${capitalize(
        connnectType,
      )} notification should appear soon...`;
    case CrossChainEventKind.RemoteChainReturnTxSubmitted:
      return `Waiting for ${action} transaction on ${capitalize(
        chain(chainId),
      )}...`;
  }
};

const capitalize = (word: string) => {
  const str = word.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const chain = (chainId: EvmChainId) => {
  switch (chainId) {
    case EvmChainId.AVALANCHE:
    case EvmChainId.AVALANCHE_FUJI_TESTNET:
      return 'Avalanche';
    default:
      return 'Ethereum';
  }
};
