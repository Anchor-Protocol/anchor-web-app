import { MsgExecuteContract } from '@terra-money/terra.js';

export const processAnchorMessage = async (
  arbitraryInfo: any,
  tokenTransfer: any,
) => {
  new MsgExecuteContract('wallet_address', 'terra_xanchor_bridge', {
    process_anchor_message: {
      instruction_vaa: Buffer.from(arbitraryInfo).toString('base64'),
      option_token_transfer_vaa: Buffer.from(tokenTransfer).toString('base64'),
    },
  });
  // return await connectedWallet.post([msg]);
  return new Promise((resolve) => resolve(true));
};
