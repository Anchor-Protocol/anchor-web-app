import { Extension } from '@terra-money/terra.js';
import { UserDeniedError } from './errors';

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

    if (error && 'code' in error && error.code === 1 && reject) {
      reject(new UserDeniedError());
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
