import { NetworkInfo } from '@terra-dev/wallet-types';
import { CreateTxOptions } from '@terra-money/terra.js';
import { Consumer, Context, createContext, useContext } from 'react';
import { TxResult } from '../tx';
import { ConnectType, WalletInfo, WalletStatus } from '../types';

export interface Wallet {
  /**
   * current client status
   *
   * this will be one of WalletStatus.INITIALIZING | WalletStatus.WALLET_NOT_CONNECTED | WalletStatus.WALLET_CONNECTED
   *
   * INITIALIZING = checking that the session and the chrome extension installation. (show the loading to users)
   * WALLET_NOT_CONNECTED = there is no connected wallet (show the connect and install options to users)
   * WALLET_CONNECTED = there is aconnected wallet (show the wallet info and disconnect button to users)
   *
   * @see Wallet#recheckStatus
   * @see WalletController#status
   */
  status: WalletStatus;

  /**
   * current selected network
   *
   * - if status is INITIALIZING or WALLET_NOT_CONNECTED = this will be the defaultNetwork
   * - if status is WALLET_CONNECTED = this depends on the connected environment
   *
   * @see WalletProviderProps#defaultNetwork
   * @see WalletController#network
   */
  network: NetworkInfo;

  /**
   * available connect types on the browser
   *
   * @see Wallet#connect
   * @see WalletController#availableConnectTypes
   */
  availableConnectTypes: ConnectType[];

  /**
   * connect to wallet
   *
   * @example
   * ```
   * const { status, availableConnectTypes, connect } = useWallet()
   *
   * return status === WalletStatus.WALLET_NOT_CONNECTED &&
   *        availableConnectTypes.includs(ConnectType.CHROME_EXTENSION) &&
   *  <button onClick={() => connect(ConnectType.CHROME_EXTENSION)}>
   *    Connct Chrome Extension
   *  </button>
   * ```
   *
   * @see Wallet#availableConnectTypes
   * @see WalletController#connect
   */
  connect: (type: ConnectType) => void;

  /**
   * manual connect to read only session
   *
   * @see Wallet#connectReadonly
   */
  connectReadonly: (terraAddress: string, network: NetworkInfo) => void;

  /**
   * available install types on the browser
   *
   * in this time, this only contains [ConnectType.CHROME_EXTENSION]
   *
   * @see Wallet#install
   * @see WalletController#availableInstallTypes
   */
  availableInstallTypes: ConnectType[];

  /**
   * install for the connect type
   *
   * @example
   * ```
   * const { status, availableInstallTypes } = useWallet()
   *
   * return status === WalletStatus.WALLET_NOT_CONNECTED &&
   *        availableInstallTypes.includes(ConnectType.CHROME_EXTENSION) &&
   *  <button onClick={() => install(ConnectType.CHROME_EXTENSION)}>
   *    Install Chrome Extension
   *  </button>
   * ```
   *
   * @see Wallet#availableInstallTypes
   * @see WalletController#install
   */
  install: (type: ConnectType) => void;

  /**
   * connected wallets
   *
   * this will be like
   * `[{ connectType: ConnectType.WALLETCONNECT, terraAddress: 'XXXXXXXXX' }]`
   *
   * in this time, you can get only one wallet. `wallets[0]`
   *
   * @see WalletController#wallets
   */
  wallets: WalletInfo[];

  /**
   * disconnect
   *
   * @example
   * ```
   * const { status, disconnect } = useWallet()
   *
   * return status === WalletStatus.WALLET_CONNECTED &&
   *  <button onClick={() => disconnect()}>
   *    Disconnect
   *  </button>
   * ```
   */
  disconnect: () => void;

  /**
   * reload the connected wallet status
   *
   * in this time, this only work on the chrome extension connection
   *
   * @see Wallet#status
   */
  recheckStatus: () => void;

  /**
   * post transaction
   *
   * @example
   * ```
   * const { post } = useWallet()
   *
   * const callback = useCallback(async () => {
   *   try {
   *    const result: TxResult = await post({...CreateTxOptions})
   *    // DO SOMETHING...
   *   } catch (error) {
   *     if (error instanceof UserDenied) {
   *       // DO SOMETHING...
   *     } else {
   *       // DO SOMETHING...
   *     }
   *   }
   * }, [])
   * ```
   *
   * @param { CreateTxOptions } tx transaction data
   * @param { { network?: NetworkInfo, terraAddress?: string } } txTarget - does not work at this time. for the future extension
   *
   * @return { Promise<TxResult> }
   *
   * @throws { UserDenied } user denied the tx
   * @throws { CreateTxFailed } did not create txhash (error dose not broadcasted)
   * @throws { TxFailed } created txhash (error broadcated)
   * @throws { Timeout } user does not act anything in specific time
   * @throws { TxUnspecifiedError } unknown error
   *
   * @see WalletController#post
   */
  post: (
    tx: CreateTxOptions,
    txTarget?: { network?: NetworkInfo; terraAddress?: string },
  ) => Promise<TxResult>;
}

// @ts-ignore
export const WalletContext: Context<Wallet> = createContext<Wallet>();

export function useWallet(): Wallet {
  return useContext(WalletContext);
}

/**
 * can use insteadof useWallet() on the class component
 */
export const WalletConsumer: Consumer<Wallet> = WalletContext.Consumer;
