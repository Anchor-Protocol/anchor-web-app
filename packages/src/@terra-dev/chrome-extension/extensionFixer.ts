import {
  ChromeExtensionCreateTxFailed,
  ChromeExtensionTxFailed,
  ChromeExtensionUnspecifiedError,
} from '@terra-dev/chrome-extension/errors';
import { UserDenied } from '@terra-dev/wallet-types';
import { Extension } from '@terra-money/terra.js';

export interface StationNetworkInfo {
  name: string;
  chainID: string;
  lcd: string;
  fcd: string;
  /** WebSocket Address */
  ws: string;
}

type ConnectResponse = { address?: string };
type PostResponse = any;
type InfoResponse = StationNetworkInfo;

export interface FixedExtension {
  isAvailable: () => boolean;
  post: (data: object) => Promise<PostResponse>;
  info: () => Promise<InfoResponse>;
  connect: () => Promise<ConnectResponse>;
  inTransactionProgress: () => boolean;
}

export function extensionFixer(extension: Extension): FixedExtension {
  let _inTransactionProgress = false;

  const postResolvers = new Map<
    number,
    [(data: any) => void, (error: any) => void]
  >();

  const infoResolvers = new Set<[(data: any) => void, (error: any) => void]>();

  const connectResolvers = new Set<
    [(data: any) => void, (error: any) => void]
  >();

  extension.on('onPost', (result) => {
    if (!result) return;

    const { error, ...payload } = result;

    if (!postResolvers.has(payload.id)) {
      return;
    }

    const [resolve, reject] = postResolvers.get(payload.id)!;

    if (!payload.success) {
      if (error && 'code' in error) {
        switch (error.code) {
          // @see https://github.com/terra-project/station/blob/main/src/extension/Confirm.tsx#L182
          case 1:
            reject(new UserDenied());
            break;
          // @see https://github.com/terra-project/station/blob/main/src/extension/Confirm.tsx#L137
          case 2:
            if (error.data) {
              const { txhash } = error.data;
              reject(new ChromeExtensionTxFailed(txhash, error.message));
            } else {
              reject(new ChromeExtensionTxFailed(undefined, error.message));
            }
            break;
          // @see https://github.com/terra-project/station/blob/main/src/extension/Confirm.tsx#L153
          case 3:
            reject(new ChromeExtensionCreateTxFailed(error.message));
            break;
          default:
            reject(new ChromeExtensionUnspecifiedError(error.message));
            break;
        }
      } else {
        reject(new ChromeExtensionUnspecifiedError());
      }
    } else if (resolve) {
      resolve({ name: 'onPost', payload });
    }

    postResolvers.delete(payload.id);

    if (postResolvers.size === 0) {
      _inTransactionProgress = false;
    }
  });

  extension.on('onInfo', (result) => {
    if (!result) return;
    const { error, ...payload } = result;

    for (const [resolve, reject] of infoResolvers) {
      if (error) {
        reject(error);
      } else {
        resolve(payload);
      }
    }

    infoResolvers.clear();
  });

  extension.on('onConnect', (result) => {
    if (!result) return;
    const { error, ...payload } = result;

    for (const [resolve, reject] of connectResolvers) {
      if (error) {
        reject(error);
      } else {
        resolve(payload);
      }
    }

    connectResolvers.clear();
  });

  function post(data: object) {
    return new Promise<PostResponse>((...resolver) => {
      _inTransactionProgress = true;

      const id = extension.post({
        ...(data as any),
        purgeQueue: true,
      });

      postResolvers.set(id, resolver);

      setTimeout(() => {
        if (postResolvers.has(id)) {
          postResolvers.delete(id);

          if (postResolvers.size === 0) {
            _inTransactionProgress = false;
          }
        }
      }, 1000 * 120);
    });
  }

  function connect() {
    return new Promise<ConnectResponse>((...resolver) => {
      connectResolvers.add(resolver);
      extension.connect();
    });
  }

  function info() {
    return new Promise<InfoResponse>((...resolver) => {
      infoResolvers.add(resolver);
      extension.info();
    });
  }

  function isAvailable() {
    return extension.isAvailable;
  }

  function inTransactionProgress() {
    return _inTransactionProgress;
  }

  return {
    post,
    connect,
    info,
    isAvailable,
    inTransactionProgress,
  };
}
