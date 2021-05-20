import { Extension } from '@terra-money/terra.js';
import { MutableRefObject } from 'react';
import { UserDeniedError } from './errors';
import { StationNetworkInfo } from './types';

type ConnectResponse = { address?: string };
type PostResponse = any;
type InfoResponse = StationNetworkInfo;

interface FixedExtension {
  isAvailable: () => boolean;
  post: (data: object) => Promise<PostResponse>;
  info: () => Promise<InfoResponse>;
  connect: () => Promise<ConnectResponse>;
}

export function extensionFixer(
  extension: Extension,
  inTransactionProgress: MutableRefObject<boolean>,
): FixedExtension {
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
    } else if (error && 'message' in error && reject) {
      reject(new Error(error.message));
    } else if (resolve) {
      resolve({ name: 'onPost', payload });
    }

    postResolvers.delete(payload.id);

    if (postResolvers.size === 0) {
      inTransactionProgress.current = false;
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
      inTransactionProgress.current = true;

      const id = extension.post({
        ...(data as any),
        purgeQueue: true,
      });

      postResolvers.set(id, resolver);

      setTimeout(() => {
        if (postResolvers.has(id)) {
          postResolvers.delete(id);

          if (postResolvers.size === 0) {
            inTransactionProgress.current = false;
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

  return {
    post,
    connect,
    info,
    isAvailable,
  };
}
