export interface CrossAnchorTx {
  txHash: string;
  chainId: number;
  // the bridge sequence number from the chain to Terra
  inputSequence?: number;
  // the bridge sequence number from Terra back to the chain
  outputSequence?: number;
}

export * from './pollCrossAnchorTx';
export * from './catchTxError';
