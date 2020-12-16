import {
  CreateTxOptions,
  Extension,
  SyncTxBroadcastResult,
} from '@terra-money/terra.js';

export type Result = SyncTxBroadcastResult.Data;
export interface PostResponse {
  id: number;
  origin: string;
  success: boolean;
  result?: Result;
  error?: { code: number; message?: string };
}

const ext = new Extension();
const extension = {
  init: () => !!ext.isAvailable,

  // info: (callback: (network?: ExtNetworkConfig) => void) => {
  //   ext.info()
  //   ext.on("onInfo", callback)
  // },

  connect: (callback: (params: { address: string }) => void) => {
    ext.connect();
    ext.on('onConnect', callback);
  },

  post: (
    options: CreateTxOptions,
    callback: (params: PostResponse) => void,
  ) => {
    const id = ext.post({
      ...options,
      purgeQueue: true,
    });

    ext.on('onPost', callback);
    return id;
  },
};

export default extension;
