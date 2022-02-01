export interface CrossAnchorTx {
  txHash: string;
  chainId: number;
}

export * from './pollTx';
export * from './catchTxError';
