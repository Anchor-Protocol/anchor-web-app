import { isMobile } from '@terra-dev/is-mobile';
import { TerraWalletconnectQrcodeModal } from '@terra-dev/walletconnect-qrcode-modal';
import { CreateTxOptions } from '@terra-money/terra.js';
import WalletConnect from '@walletconnect/client';
import {
  IPushServerOptions,
  IWalletConnectOptions,
} from '@walletconnect/types';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  WalletConnectSession,
  WalletConnectSessionStatus,
  WalletConnectTxResult,
} from './types';

export interface WalletConnectControllerOptions {
  /**
   * Configuration parameter that `new WalletConnect(connectorOpts)`
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
   * Configuration parameter that `new WalletConnect(_, pushServerOpts)`
   *
   * @default undefined
   */
  pushServerOpts?: IPushServerOptions;
}

export interface WalletConnectController {
  session: () => Observable<WalletConnectSession>;
  getLatestSession: () => WalletConnectSession;
  post: (tx: CreateTxOptions) => Promise<WalletConnectTxResult>;
  disconnect: () => void;
}

const WALLETCONNECT_STORAGE_KEY = 'walletconnect';

export function connectIfSessionExists(
  options: WalletConnectControllerOptions = {},
): WalletConnectController | null {
  const storedSession = localStorage.getItem(WALLETCONNECT_STORAGE_KEY);

  if (typeof storedSession === 'string') {
    return connect(options);
  }

  return null;
}

export function connect(
  options: WalletConnectControllerOptions = {},
): WalletConnectController {
  let connector: WalletConnect | null = null;

  let sessionSubject: BehaviorSubject<WalletConnectSession> = new BehaviorSubject<WalletConnectSession>(
    {
      status: WalletConnectSessionStatus.DISCONNECTED,
    },
  );

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
      debugger;
    });

    connector.on('connect', (error, payload) => {
      if (error) throw error;

      sessionSubject.next({
        status: WalletConnectSessionStatus.CONNECTED,
        peerMeta: payload.params[0],
        terraAddress: payload.params[0].accounts[0],
        chainId: payload.params[0].chainId,
      });
    });

    connector.on('disconnect', (error, payload) => {
      if (error) throw error;

      sessionSubject.next({
        status: WalletConnectSessionStatus.DISCONNECTED,
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
      status: WalletConnectSessionStatus.CONNECTED,
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
            status: WalletConnectSessionStatus.DISCONNECTED,
          });
        });
      }

      initEvents();

      sessionSubject.next({
        status: WalletConnectSessionStatus.REQUESTED,
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
      status: WalletConnectSessionStatus.DISCONNECTED,
    });
  }

  function session(): Observable<WalletConnectSession> {
    return sessionSubject.asObservable();
  }

  function getLatestSession(): WalletConnectSession {
    return sessionSubject.getValue();
  }

  function post(tx: CreateTxOptions): Promise<WalletConnectTxResult> {
    if (!connector || !connector.connected) {
      throw new Error(`WalletConnect is not connected!`);
    }

    const id = Date.now();

    const serializedTxOptions = {
      msgs: tx.msgs.map((msg) => msg.toJSON()),
      fee: tx.fee?.toJSON(),
      memo: tx.memo,
      gasPrices: tx.gasPrices?.toString(),
      gasAdjustment: tx.gasAdjustment?.toString(),
      account_number: tx.account_number,
      sequence: tx.sequence,
      feeDenoms: tx.feeDenoms,
    };

    if (isMobile()) {
      window.open(
        `terrastation://wallet_connect_confirm?id=${id}&params=${JSON.stringify(
          serializedTxOptions,
        )}`,
      );
    }

    return connector.sendCustomRequest({
      id,
      method: 'send',
      params: [serializedTxOptions],
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
