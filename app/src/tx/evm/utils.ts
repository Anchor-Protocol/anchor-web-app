import {
  CrossChainEvent,
  CrossChainEventKind,
} from '@anchor-protocol/crossanchor-sdk';
import { TxStreamPhase } from '@libs/app-fns';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { BigNumberish } from 'ethers';
import { ConnectType } from '@libs/evm-wallet';

const decimals = 6;

export const TX_GAS_LIMIT = 2100000;

// TODO: replace fromWei and toWei with proper formatting functions
export function fromWei(value: BigNumberish): string {
  return formatUnits(value, decimals);
}

export function toWei(value: BigNumberish): string {
  return parseUnits(String(value), decimals).toString();
}

export const txResult = (event: CrossChainEvent, connnectType: ConnectType) => {
  return {
    value: null,
    message: txResultMessage(event, connnectType),
    phase: TxStreamPhase.BROADCAST,
    receipts: [],
  };
};

const txResultMessage = (event: CrossChainEvent, connnectType: ConnectType) => {
  switch (event.kind) {
    case CrossChainEventKind.CrossChainTxCompleted:
      return 'Cross chain transaction completed.';
    case CrossChainEventKind.RemoteChainTxRequested:
      return `Deposit requested. ${capitalize(
        connnectType,
      )} notification should appear soon.`;
    case CrossChainEventKind.RemoteChainTxExecuted:
      return 'Ethereum transaction successful, waiting for Wormhole bridge...';
    case CrossChainEventKind.RemoteChainWormholeEntered:
      return 'Entering Wormhole bridge on Ethereum...';
    case CrossChainEventKind.TerraWormholeEntered:
      return 'Exiting Wormhole bridge on Ethereum, entering Terra...';
    case CrossChainEventKind.TerraWormholeExited:
      return 'Terra action executed, exiting Wormhole bridge on Terra...';
    case CrossChainEventKind.RemoteChainTxSubmitted:
      return 'Waiting for deposit transaction on Ethereum...';
    case CrossChainEventKind.RemoteChainApprovalRequested:
      return `Allowance requested. ${capitalize(
        connnectType,
      )} notification should appear soon.`;
    case CrossChainEventKind.RemoteChainApprovalSubmitted:
      return 'Waiting for approval transaction on Ethereum...';
  }
};

const capitalize = (word: string) => {
  const str = word.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};
