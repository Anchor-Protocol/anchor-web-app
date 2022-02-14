export interface Bridge {
  depositStable(token: string, amount: string): Promise<[number, number]>;
  processTokenTransferInstruction(
    actionVAA: Uint8Array,
    tokenTransferVAA: Uint8Array,
  ): Promise<any>;
}
