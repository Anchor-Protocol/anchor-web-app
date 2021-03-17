import { UserDeniedError } from '@anchor-protocol/wallet-provider/errors';
import { StationNetworkInfo } from '@anchor-protocol/wallet-provider/types';
import { Extension } from '@terra-money/terra.js';

type ConnectResponse = { address?: string };
type PostResponse = any;
type InfoResponse = StationNetworkInfo;

interface FixedExtension {
  isAvailable: () => boolean;
  post: (data: object) => Promise<PostResponse>;
  info: () => Promise<InfoResponse>;
  connect: () => Promise<ConnectResponse>;
}

export function extensionFixer(extension: Extension): FixedExtension {
  const postResolvers = new Map<
    number,
    [(data: any) => void, (error: any) => void]
  >();

  const infoResolvers = new Set<[(data: any) => void, (error: any) => void]>();

  const connectResolvers = new Set<
    [(data: any) => void, (error: any) => void]
  >();

  extension.on('onPost', ({ error, ...payload }) => {
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
  });

  extension.on('onInfo', ({ error, ...payload }) => {
    for (const [resolve, reject] of infoResolvers) {
      if (error) {
        reject(error);
      } else {
        resolve(payload);
      }
    }

    infoResolvers.clear();
  });

  extension.on('onConnect', ({ error, ...payload }) => {
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
      const id = extension.post({
        ...(data as any),
        purgeQueue: true,
      });

      postResolvers.set(id, resolver);
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

  return {
    post,
    connect,
    info,
    isAvailable,
  };
}
