import {
  Chain,
  CrossChainEvent,
  CrossChainEventKind,
} from '@anchor-protocol/crossanchor-sdk';
import { TxStreamPhase } from '@libs/app-fns';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { BigNumberish } from 'ethers';
import { ConnectType } from '@libs/evm-wallet';

const decimals = 6;

export const TX_GAS_LIMIT = 250000;

// TODO: replace fromWei and toWei with proper formatting functions
export function fromWei(value: BigNumberish): string {
  return formatUnits(value, decimals);
}

export function toWei(value: BigNumberish): string {
  return parseUnits(String(value), decimals).toString();
}

export const txResult = (
  event: CrossChainEvent,
  connnectType: ConnectType,
  chain: Chain,
  action: string,
) => {
  return {
    value: null,
    message: txResultMessage(event, connnectType, chain, action),
    phase: TxStreamPhase.BROADCAST,
    receipts: [],
  };
};

const txResultMessage = (
  event: CrossChainEvent,
  connnectType: ConnectType,
  chain: Chain,
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
        chain,
      )} transaction successful, waiting for Wormhole bridge...`;
    case CrossChainEventKind.RemoteChainWormholeEntered:
      return `Entering Wormhole bridge on ${capitalize(chain)}...`;
    case CrossChainEventKind.TerraWormholeEntered:
      return `Entering Terra, executing ${action} action...`;
    case CrossChainEventKind.TerraWormholeExited:
      return `Terra action executed, exiting Wormhole bridge on Terra...`;
    case CrossChainEventKind.RemoteChainTxSubmitted:
      return `Waiting for ${action} transaction on ${capitalize(chain)}...`;
    case CrossChainEventKind.RemoteChainApprovalRequested:
      return `Allowance requested. ${capitalize(
        connnectType,
      )} notification should appear soon...`;
    case CrossChainEventKind.RemoteChainApprovalSubmitted:
      return `Waiting for approval transaction on ${capitalize(chain)}...`;
  }
};

const capitalize = (word: string) => {
  const str = word.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};
