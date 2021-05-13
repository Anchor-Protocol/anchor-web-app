import {
  ChromeExtensionController,
  ChromeExtensionCreateTxFailed,
  ChromeExtensionStatus,
  ChromeExtensionTxFailed,
  ChromeExtensionUnspecifiedError,
} from '@terra-dev/chrome-extension';
import { isDesktopChrome } from '@terra-dev/is-desktop-chrome';
import {
  connect as reConnect,
  connectIfSessionExists as reConnectIfSessionExists,
  ReadonlyWalletController,
  ReadonlyWalletSession,
} from '@terra-dev/readonly-wallet';
import { readonlyWalletModal } from '@terra-dev/readonly-wallet-modal';
import {
  CreateTxFailed,
  NetworkInfo,
  Timeout,
  TxFailed,
  TxUnspecifiedError,
  UserDenied,
} from '@terra-dev/wallet-types';
import {
  connect as wcConnect,
  connectIfSessionExists as wcConnectIfSessionExists,
  WalletConnectController,
  WalletConnectControllerOptions,
  WalletConnectCreateTxFailed,
  WalletConnectSessionStatus,
  WalletConnectTimeout,
  WalletConnectTxFailed,
  WalletConnectTxResult,
  WalletConnectTxUnspecifiedError,
  WalletConnectUserDenied,
} from '@terra-dev/walletconnect';
import {
  WebExtensionController,
  WebExtensionCreateTxFailed,
  WebExtensionStatusType,
  WebExtensionTxFailed,
  WebExtensionTxProgress,
  WebExtensionTxStatus,
  WebExtensionTxSucceed,
  WebExtensionUserDenied,
} from '@terra-dev/web-extension';
import { AccAddress, CreateTxOptions } from '@terra-money/terra.js';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  CHROME_EXTENSION_INSTALL_URL,
  WEB_EXTENSION_CONNECTED_KEY,
} from './env';
import { TxResult } from './tx';
import { ConnectType, WalletInfo, WalletStatus } from './types';
import { checkAvailableExtension } from './utils/checkAvailableExtension';

export interface WalletControllerOptions
  extends WalletConnectControllerOptions {
  /**
   * fallback network if controller is not connected
   */
  defaultNetwork: NetworkInfo;

  /**
   * for walletconnect
   *
   * @example
   * ```
   * const mainnet: NetworkInfo = {
   *  name: 'mainnet',
   *  chainID: 'columbus-4',
   *  lcd: 'https://lcd.terra.dev',
   * }
   *
   * const testnet: NetworkInfo = {
   *  name: 'testnet',
   *  chainID: 'tequila-0004',
   *  lcd: 'https://tequila-lcd.terra.dev',
   * }
   *
   * const walletConnectChainIds: Record<number, NetworkInfo> = {
   *   0: testnet,
   *   1: mainnet,
   * }
   *
   * <WalletProvider walletConnectChainIds={walletConnectChainIds}>
   * ```
   */
  walletConnectChainIds: Record<number, NetworkInfo>;

  /**
   * run at executing the `connect(ConnectType.READONLY)`
   */
  createReadonlyWalletSession?: (
    networks: NetworkInfo[],
  ) => Promise<ReadonlyWalletSession | null>;

  /**
   * milliseconds to wait checking chrome extension is installed
   *
   * @default 1000 * 3 miliseconds
   */
  waitingChromeExtensionInstallCheck?: number;

  /**
   * milliseconds to re-create wallet connect instance when reactivate after deactivate
   *
   * @default 1000 * 60 * 5
   */
  walletConnectInstanceRecreateTimes?: number;
}

const defaultWaitingChromeExtensionInstallCheck = 1000 * 3;
const defaultWalletConnectInstanceRecreateTimes = 1000 * 60 * 5;

export class WalletController {
  private chromeExtension: ChromeExtensionController | null = null;
  private webExtension: WebExtensionController | null = null;
  private walletConnect: WalletConnectController | null = null;
  private readonlyWallet: ReadonlyWalletController | null = null;

  private _availableConnectTypes: BehaviorSubject<ConnectType[]>;
  private _availableInstallTypes: BehaviorSubject<ConnectType[]>;
  private _status: BehaviorSubject<WalletStatus>;
  private _network: BehaviorSubject<NetworkInfo>;
  private _wallets: BehaviorSubject<WalletInfo[]>;

  private disableReadonlyWallet: (() => void) | null = null;
  private disableChromeExtension: (() => void) | null = null;
  private disableWebExtension: (() => void) | null = null;
  private disableWalletConnect: (() => void) | null = null;

  constructor(readonly options: WalletControllerOptions) {
    this._availableConnectTypes = new BehaviorSubject<ConnectType[]>([
      ConnectType.READONLY,
      ConnectType.WALLETCONNECT,
    ]);

    this._availableInstallTypes = new BehaviorSubject<ConnectType[]>([]);

    this._status = new BehaviorSubject<WalletStatus>(WalletStatus.INITIALIZING);

    this._network = new BehaviorSubject<NetworkInfo>(options.defaultNetwork);

    this._wallets = new BehaviorSubject<WalletInfo[]>([]);

    let numSessionCheck: number = 0;

    // wait checking the availability of the chrome extension
    // 0. check if extension wallet session is exists
    checkAvailableExtension(
      options.waitingChromeExtensionInstallCheck ??
        defaultWaitingChromeExtensionInstallCheck,
    ).then((extensionType) => {
      if (extensionType === ConnectType.WEBEXTENSION) {
        this._availableConnectTypes.next([
          ConnectType.READONLY,
          ConnectType.WEBEXTENSION,
          ConnectType.WALLETCONNECT,
        ]);

        this.webExtension = new WebExtensionController(window);

        const subscription = this.webExtension
          .status()
          .pipe(
            filter((webExtensionStatus) => {
              return (
                webExtensionStatus.type !== WebExtensionStatusType.INITIALIZING
              );
            }),
          )
          .subscribe((webExtensionStatus) => {
            subscription.unsubscribe();

            if (
              webExtensionStatus.type === WebExtensionStatusType.READY &&
              localStorage.getItem(WEB_EXTENSION_CONNECTED_KEY) === 'true' &&
              !this.disableWalletConnect &&
              !this.disableReadonlyWallet
            ) {
              this.enableWebExtension();
            } else if (numSessionCheck === 0) {
              numSessionCheck += 1;
            } else {
              this._status.next(WalletStatus.WALLET_NOT_CONNECTED);
              localStorage.removeItem(WEB_EXTENSION_CONNECTED_KEY);
            }
          });
      } else if (extensionType === ConnectType.CHROME_EXTENSION) {
        this._availableConnectTypes.next([
          ConnectType.READONLY,
          ConnectType.CHROME_EXTENSION,
          ConnectType.WALLETCONNECT,
        ]);

        this.chromeExtension = new ChromeExtensionController({
          enableWalletConnection: true,
          defaultNetwork: options.defaultNetwork,
        });

        const subscription = this.chromeExtension
          .status()
          .pipe(
            filter((chromeExtensionStatus) => {
              return (
                chromeExtensionStatus !== ChromeExtensionStatus.INITIALIZING
              );
            }),
          )
          .subscribe((chromeExtensionStatus) => {
            try {
              subscription.unsubscribe();
            } catch {}

            if (
              chromeExtensionStatus ===
                ChromeExtensionStatus.WALLET_CONNECTED &&
              !this.disableWalletConnect &&
              !this.disableReadonlyWallet
            ) {
              this.enableChromeExtension();
            } else if (numSessionCheck === 0) {
              numSessionCheck += 1;
            } else {
              this._status.next(WalletStatus.WALLET_NOT_CONNECTED);
            }
          });
      } else {
        if (isDesktopChrome()) {
          this._availableInstallTypes.next([ConnectType.CHROME_EXTENSION]);
        }

        if (numSessionCheck === 0) {
          numSessionCheck += 1;
        } else {
          this._status.next(WalletStatus.WALLET_NOT_CONNECTED);
        }
      }
    });

    // 1. check if readonly wallet session is exists
    const draftReadonlyWallet = reConnectIfSessionExists();

    if (draftReadonlyWallet) {
      this.enableReadonlyWallet(draftReadonlyWallet);
      return;
    }

    // 2. check if walletconnect sesison is exists
    const draftWalletConnect = wcConnectIfSessionExists(options);

    if (
      draftWalletConnect &&
      draftWalletConnect.getLatestSession().status ===
        WalletConnectSessionStatus.CONNECTED
    ) {
      this.enableWalletConnect(draftWalletConnect);
    } else if (numSessionCheck === 0) {
      numSessionCheck += 1;
    } else {
      this._status.next(WalletStatus.WALLET_NOT_CONNECTED);
    }
  }

  /** @see Wallet#availableConnectTypes */
  availableConnectTypes = (): Observable<ConnectType[]> => {
    return this._availableConnectTypes.asObservable();
  };

  /** @see Wallet#availableInstallTypes */
  availableInstallTypes = (): Observable<ConnectType[]> => {
    return this._availableInstallTypes.asObservable();
  };

  /** @see Wallet#status */
  status = (): Observable<WalletStatus> => {
    return this._status.asObservable();
  };

  /** @see Wallet#network */
  network = (): Observable<NetworkInfo> => {
    return this._network.asObservable();
  };

  /** @see Wallet#wallets */
  wallets = (): Observable<WalletInfo[]> => {
    return this._wallets.asObservable();
  };

  /** @see Wallet#recheckStatus */
  recheckStatus = () => {
    if (this.disableChromeExtension) {
      this.chromeExtension?.recheckStatus();
    }
  };

  /** @see Wallet#install */
  install = (type: ConnectType) => {
    if (type === ConnectType.CHROME_EXTENSION) {
      window.open(CHROME_EXTENSION_INSTALL_URL, '_blank');
    } else if (type === ConnectType.WEBEXTENSION) {
      const webExtensionStatus = this.webExtension?.getLastStatus();
      if (
        webExtensionStatus?.type === WebExtensionStatusType.NO_AVAILABLE &&
        webExtensionStatus.installLink
      ) {
        window.open(webExtensionStatus.installLink, '_blank');
      }
    } else {
      console.warn(`ConnectType "${type}" does not support install() function`);
    }
  };

  /** @see Wallet#connect */
  connect = (type: ConnectType) => {
    switch (type) {
      case ConnectType.READONLY:
        const networks: NetworkInfo[] = Object.keys(
          this.options.walletConnectChainIds,
        ).map((chainId) => this.options.walletConnectChainIds[+chainId]);

        const createReadonlyWalletSession =
          this.options.createReadonlyWalletSession?.(networks) ??
          readonlyWalletModal({ networks });

        createReadonlyWalletSession.then((readonlyWalletSession) => {
          if (readonlyWalletSession) {
            this.enableReadonlyWallet(reConnect(readonlyWalletSession));
          }
        });
        break;
      case ConnectType.WALLETCONNECT:
        this.enableWalletConnect(wcConnect(this.options));
        break;
      case ConnectType.CHROME_EXTENSION:
        this.chromeExtension!.connect().then((success) => {
          if (success) {
            this.enableChromeExtension();
          }
        });
        break;
      case ConnectType.WEBEXTENSION:
        this.enableWebExtension();
        break;
      default:
        throw new Error(`Unknown ConnectType!`);
    }
  };

  /** @see Wallet#disconnect */
  disconnect = () => {
    this.disableReadonlyWallet?.();
    this.disableReadonlyWallet = null;

    this.disableChromeExtension?.();
    this.disableChromeExtension = null;

    this.disableWebExtension?.();
    this.disableWebExtension = null;

    this.disableWalletConnect?.();
    this.disableWalletConnect = null;

    localStorage.removeItem(WEB_EXTENSION_CONNECTED_KEY);
    this._status.next(WalletStatus.WALLET_NOT_CONNECTED);
    this._network.next(this.options.defaultNetwork);
    this._wallets.next([]);
  };

  /** @see Wallet#post */
  post = async (
    tx: CreateTxOptions,
    // TODO not work at this time. for the future extension
    txTarget: { network?: NetworkInfo; terraAddress?: string } = {},
  ): Promise<TxResult> => {
    // ---------------------------------------------
    // chrome extension - legacy extension
    // ---------------------------------------------
    if (this.disableChromeExtension) {
      if (!this.chromeExtension) {
        throw new Error(`chromeExtension instance not created!`);
      }

      return (
        this.chromeExtension
          // TODO make WalletConnectTxResult to common type
          .post<CreateTxOptions, { result: WalletConnectTxResult }>(tx)
          .then(({ payload }) => {
            return {
              ...tx,
              result: payload.result,
              success: true,
            } as TxResult;
          })
          .catch((error) => {
            if (error instanceof ChromeExtensionCreateTxFailed) {
              throw new CreateTxFailed(tx, error.message);
            } else if (error instanceof ChromeExtensionTxFailed) {
              throw new TxFailed(tx, error.txhash, error.message, null);
            } else if (error instanceof ChromeExtensionUnspecifiedError) {
              throw new TxUnspecifiedError(tx, error.message);
            }
            // UserDeniedError
            // All unspecified errors...
            throw error;
          })
      );
    }
    // ---------------------------------------------
    // web extension - new extension
    // ---------------------------------------------
    else if (this.disableWebExtension) {
      return new Promise<TxResult>((resolve, reject) => {
        if (!this.webExtension) {
          reject(new Error(`webExtension instance not created!`));
          return;
        }

        const webExtensionStates = this.webExtension.getLastStates();

        if (!webExtensionStates) {
          reject(new Error(`webExtension.getLastStates() returns undefined!`));
          return;
        }

        const focusedWallet = txTarget.terraAddress
          ? webExtensionStates.wallets.find(
              (itemWallet) => itemWallet.terraAddress === txTarget.terraAddress,
            ) ?? webExtensionStates.wallets[0]
          : webExtensionStates.focusedWalletAddress
          ? webExtensionStates.wallets.find(
              (itemWallet) =>
                itemWallet.terraAddress ===
                webExtensionStates.focusedWalletAddress,
            ) ?? webExtensionStates.wallets[0]
          : webExtensionStates.wallets[0];

        const subscription = this.webExtension
          .post({
            terraAddress: focusedWallet.terraAddress,
            network:
              { ...webExtensionStates.network, ...txTarget.network } ??
              webExtensionStates.network,
            tx,
          })
          .subscribe({
            next: (
              extensionTxResult: WebExtensionTxProgress | WebExtensionTxSucceed,
            ) => {
              switch (extensionTxResult.status) {
                case WebExtensionTxStatus.SUCCEED:
                  resolve({
                    ...tx,
                    result: extensionTxResult.payload,
                    success: true,
                  });
                  subscription.unsubscribe();
                  break;
              }
            },
            error: (error) => {
              if (error instanceof WebExtensionUserDenied) {
                reject(new UserDenied());
              } else if (error instanceof WebExtensionCreateTxFailed) {
                reject(new CreateTxFailed(tx, error.message));
              } else if (error instanceof WebExtensionTxFailed) {
                reject(
                  new TxFailed(
                    tx,
                    error.txhash,
                    error.message,
                    error.raw_message,
                  ),
                );
              } else {
                reject(
                  new TxUnspecifiedError(
                    tx,
                    'message' in error ? error.message : String(error),
                  ),
                );
              }
              subscription.unsubscribe();
            },
          });
      });
    }
    // ---------------------------------------------
    // wallet connect
    // ---------------------------------------------
    else if (this.walletConnect) {
      return this.walletConnect
        .post(tx)
        .then(
          (result) =>
            ({
              ...tx,
              result,
              success: true,
            } as TxResult),
        )
        .catch((error) => {
          let throwError = error;

          try {
            if (error instanceof WalletConnectUserDenied) {
              throwError = new UserDenied();
            } else if (error instanceof WalletConnectCreateTxFailed) {
              throwError = new CreateTxFailed(tx, error.message);
            } else if (error instanceof WalletConnectTxFailed) {
              throwError = new TxFailed(
                tx,
                error.txhash,
                error.message,
                error.raw_message,
              );
            } else if (error instanceof WalletConnectTimeout) {
              throwError = new Timeout(error.message);
            } else if (error instanceof WalletConnectTxUnspecifiedError) {
              throwError = new TxUnspecifiedError(tx, error.message);
            }
          } catch {
            throwError = new TxUnspecifiedError(
              tx,
              'message' in error ? error.message : String(error),
            );
          }

          throw throwError;
        });
    } else {
      throw new Error(`There are no connections that can be posting tx!`);
    }
  };

  // ================================================================
  // internal
  // connect type changing
  // ================================================================

  private enableReadonlyWallet = (readonlyWallet: ReadonlyWalletController) => {
    this.disableWalletConnect?.();
    this.disableChromeExtension?.();
    this.disableWebExtension?.();

    if (this.readonlyWallet === readonlyWallet) {
      return;
    }

    if (this.readonlyWallet) {
      this.readonlyWallet.disconnect();
    }

    this.readonlyWallet = readonlyWallet;

    this._status.next(WalletStatus.WALLET_CONNECTED);
    this._network.next(readonlyWallet.network);
    this._wallets.next([
      {
        connectType: ConnectType.READONLY,
        terraAddress: readonlyWallet.terraAddress,
        design: 'readonly',
      },
    ]);

    this.disableReadonlyWallet = () => {
      readonlyWallet.disconnect();
      this.readonlyWallet = null;
      this.disableReadonlyWallet = null;
    };
  };

  private enableWebExtension = () => {
    this.disableReadonlyWallet?.();
    this.disableWalletConnect?.();
    this.disableChromeExtension?.();

    if (this.disableWebExtension || !this.webExtension) {
      return;
    }

    const extensionSubscription = combineLatest([
      this.webExtension.status(),
      this.webExtension.states(),
    ]).subscribe(([status, states]) => {
      if (!states) {
        return;
      }

      this._network.next(states.network);

      if (status.type === WebExtensionStatusType.READY) {
        this._status.next(WalletStatus.WALLET_CONNECTED);
        if (states.wallets.length > 0) {
          const focusedWallet = states.focusedWalletAddress
            ? states.wallets.find(
                (itemWallet) =>
                  itemWallet.terraAddress === states.focusedWalletAddress,
              ) ?? states.wallets[0]
            : states.wallets[0];
          this._wallets.next([
            {
              connectType: ConnectType.WEBEXTENSION,
              terraAddress: focusedWallet.terraAddress,
              design: focusedWallet.design,
            },
          ]);
        }
      } else if (status.type === WebExtensionStatusType.NO_AVAILABLE) {
        localStorage.removeItem(WEB_EXTENSION_CONNECTED_KEY);
        this._status.next(WalletStatus.WALLET_NOT_CONNECTED);
        this._wallets.next([]);

        if (!status.isApproved && this.disableWebExtension) {
          this.disableWebExtension();
        }
      }
    });

    localStorage.setItem(WEB_EXTENSION_CONNECTED_KEY, 'true');

    const lastExtensionStatus = this.webExtension.getLastStatus();

    if (
      lastExtensionStatus.type === WebExtensionStatusType.NO_AVAILABLE &&
      lastExtensionStatus.isApproved === false
    ) {
      this.webExtension.requestApproval();
    }

    this.disableWebExtension = () => {
      localStorage.removeItem(WEB_EXTENSION_CONNECTED_KEY);
      extensionSubscription.unsubscribe();
      this.disableWebExtension = null;
    };
  };

  private enableChromeExtension = () => {
    this.disableReadonlyWallet?.();
    this.disableWalletConnect?.();
    this.disableWebExtension?.();

    if (this.disableChromeExtension || !this.chromeExtension) {
      return;
    }

    const extensionSubscription = combineLatest([
      this.chromeExtension.status(),
      this.chromeExtension.networkInfo(),
      this.chromeExtension.terraAddress(),
    ]).subscribe({
      next: ([status, networkInfo, terraAddress]) => {
        this._network.next(networkInfo);

        if (
          status === ChromeExtensionStatus.WALLET_CONNECTED &&
          typeof terraAddress === 'string' &&
          AccAddress.validate(terraAddress)
        ) {
          this._status.next(WalletStatus.WALLET_CONNECTED);
          this._wallets.next([
            {
              connectType: ConnectType.CHROME_EXTENSION,
              terraAddress,
              design: 'extension',
            },
          ]);
        } else {
          this._status.next(WalletStatus.WALLET_NOT_CONNECTED);
          this._wallets.next([]);
        }
      },
    });

    this.disableChromeExtension = () => {
      this.chromeExtension?.disconnect();
      extensionSubscription.unsubscribe();
      this.disableChromeExtension = null;
    };
  };

  private enableWalletConnect = (walletConnect: WalletConnectController) => {
    this.disableReadonlyWallet?.();
    this.disableChromeExtension?.();
    this.disableWebExtension?.();

    if (this.walletConnect === walletConnect) {
      return;
    }

    if (this.walletConnect) {
      this.walletConnect.disconnect();
    }

    this.walletConnect = walletConnect;

    const subscribeWalletConnect = (
      wc: WalletConnectController,
    ): Subscription => {
      return wc.session().subscribe({
        next: (status) => {
          switch (status.status) {
            case WalletConnectSessionStatus.CONNECTED:
              this._status.next(WalletStatus.WALLET_CONNECTED);
              this._network.next(
                this.options.walletConnectChainIds[status.chainId] ??
                  this.options.defaultNetwork,
              );
              this._wallets.next([
                {
                  connectType: ConnectType.WALLETCONNECT,
                  terraAddress: status.terraAddress,
                  design: 'walletconnect',
                },
              ]);
              break;
            default:
              this._status.next(WalletStatus.WALLET_NOT_CONNECTED);
              this._network.next(this.options.defaultNetwork);
              this._wallets.next([]);
              break;
          }
        },
      });
    };

    let walletConnectSessionSubscription = subscribeWalletConnect(
      walletConnect,
    );

    let lastInvisibleTime = -1;

    const onVisibilityChange = () => {
      if (document.hidden) {
        lastInvisibleTime = Date.now();
      } else if (lastInvisibleTime > 0) {
        const t = Date.now() - lastInvisibleTime;
        const recreateTime =
          this.options.walletConnectInstanceRecreateTimes ??
          defaultWalletConnectInstanceRecreateTimes;

        if (t > recreateTime) {
          this.walletConnect?.destroy();
          const newWalletConnect = wcConnect(this.options, true);
          this.walletConnect = newWalletConnect;
          walletConnectSessionSubscription = subscribeWalletConnect(
            newWalletConnect,
          );
        }

        lastInvisibleTime = -1;
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    this.disableWalletConnect = () => {
      this.walletConnect?.disconnect();
      this.walletConnect = null;
      walletConnectSessionSubscription.unsubscribe();
      this.disableWalletConnect = null;
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  };
}
