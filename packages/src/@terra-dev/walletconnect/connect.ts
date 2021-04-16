import { TerraWalletconnectQrcodeModal } from '@terra-dev/walletconnect-qrcode-modal';
import { Session, SessionStatus, WalletConnectTxResult } from './types';
import { CreateTxOptions } from '@terra-money/terra.js';
import WalletConnect from '@walletconnect/client';
import {
  IPushServerOptions,
  IWalletConnectOptions,
} from '@walletconnect/types';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WalletConnectControllerOptions {
  /**
   * Configuration parameter of `new WalletConnect(connectorOpts)`
   *
   * @default
   * ```js
   * {
   *   bridge: 'https://bridge.walletconnect.org',
   *   qrcodeModal: new TerraWalletconnectQrcodeModal(),
   * }
   * ```
   */
  connectorOpts?: IWalletConnectOptions;

  /**
   * Configuration parameter of `new WalletConnect(_, pushServerOpts)`
   *
   * @default undefined
   */
  pushServerOpts?: IPushServerOptions;
}

export interface WalletConnectController {
  session: () => Observable<Session>;
  getLatestSession: () => Session;
  post: (tx: CreateTxOptions) => Promise<WalletConnectTxResult>;
  disconnect: () => void;
}

export function connectWalletIfSessionExists(
  options: WalletConnectControllerOptions = {},
): WalletConnectController | null {
  const cachedSession = localStorage.getItem('walletconnect');

  if (typeof cachedSession === 'string') {
    return connectWallet(options);
  }

  return null;
}

export function connectWallet(
  options: WalletConnectControllerOptions = {},
): WalletConnectController {
  let connector: WalletConnect | null = null;

  let sessionSubject: BehaviorSubject<Session> = new BehaviorSubject<Session>({
    status: SessionStatus.DISCONNECTED,
  });

  const qrcodeModal =
    options.connectorOpts?.qrcodeModal ?? new TerraWalletconnectQrcodeModal();

  const connectorOpts: IWalletConnectOptions = {
    bridge: 'https://bridge.walletconnect.org',
    qrcodeModal,
    ...options.connectorOpts,
  };

  const pushServerOpts: IPushServerOptions | undefined = options.pushServerOpts;

  // ---------------------------------------------
  // event listeners
  // ---------------------------------------------
  function initEvents() {
    if (!connector) {
      throw new Error(`WalletConnect is not defined!`);
    }

    // ? : 테스트 상에서 발생되지 않고 있음
    connector.on('session_update', async (error, payload) => {
      if (error) throw error;

      const { chainId, accounts } = payload.params[0];

      console.log('app.tsx..()', chainId, accounts);
    });

    connector.on('connect', (error, payload) => {
      if (error) throw error;

      sessionSubject.next({
        status: SessionStatus.CONNECTED,
        peerMeta: payload.params[0],
        terraAddress: payload.params[0].accounts[0],
        chainId: payload.params[0].chainId,
      });
    });

    connector.on('disconnect', (error, payload) => {
      if (error) throw error;

      sessionSubject.next({
        status: SessionStatus.DISCONNECTED,
      });
    });
  }

  // ---------------------------------------------
  // initialize
  // ---------------------------------------------
  const cachedSession = localStorage.getItem('walletconnect');

  if (typeof cachedSession === 'string') {
    const draftConnector = new WalletConnect(
      {
        ...connectorOpts,
        session: JSON.parse(cachedSession),
      },
      pushServerOpts,
    );

    connector = draftConnector;

    initEvents();

    sessionSubject.next({
      status: SessionStatus.CONNECTED,
      peerMeta: draftConnector.peerMeta!,
      terraAddress: draftConnector.accounts[0],
      chainId: draftConnector.chainId,
    });
  } else {
    const draftConnector = new WalletConnect(connectorOpts, pushServerOpts);

    connector = draftConnector;

    if (!draftConnector.connected) {
      draftConnector.createSession();

      if (qrcodeModal instanceof TerraWalletconnectQrcodeModal) {
        qrcodeModal.setCloseCallback(() => {
          sessionSubject.next({
            status: SessionStatus.DISCONNECTED,
          });
        });
      }

      initEvents();

      sessionSubject.next({
        status: SessionStatus.REQUESTED,
      });
    }
  }

  // ---------------------------------------------
  // methods
  // ---------------------------------------------
  function disconnect() {
    if (connector) {
      try {
        connector.killSession();
      } catch {}
    }

    sessionSubject.next({
      status: SessionStatus.DISCONNECTED,
    });
  }

  function session(): Observable<Session> {
    return sessionSubject.asObservable();
  }

  function getLatestSession(): Session {
    return sessionSubject.getValue();
  }

  function post(tx: CreateTxOptions): Promise<WalletConnectTxResult> {
    if (!connector || !connector.connected) {
      throw new Error(`WalletConnect is not connected!`);
    }

    return connector.sendCustomRequest({
      id: Date.now(),
      method: 'terra',
      params: [
        {
          msgs: tx.msgs.map((msg) => msg.toJSON()),
          fee: tx.fee?.toJSON(),
          memo: tx.memo,
          gasPrices: tx.gasPrices?.toString(),
          gasAdjustment: tx.gasAdjustment?.toString(),
          account_number: tx.account_number,
          sequence: tx.sequence,
          feeDenoms: tx.feeDenoms,
        },
      ],
    });
  }

  // ---------------------------------------------
  // return
  // ---------------------------------------------
  return {
    session,
    getLatestSession,
    post,
    disconnect,
  };
}
