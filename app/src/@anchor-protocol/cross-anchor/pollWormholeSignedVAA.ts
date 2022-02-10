import { CrossAnchorTx } from '.';
import sleep from '@libs/sleep';

// this will poll the CrossAnchor Bridge API to track the status of a tx
export const pollWormholeSignedVAA = async (
  tx: CrossAnchorTx,
): Promise<CrossAnchorTx> => {
  await sleep(4000);
  return {
    ...tx,
  };
};
