import sleep from '@libs/sleep';
import { CrossAnchorTx } from '.';

export const pollTerra = async (tx: CrossAnchorTx): Promise<CrossAnchorTx> => {
  await sleep(1500);
  return {
    ...tx,
    outputSequence: tx.inputSequence ?? 0 + 1,
  };
};
