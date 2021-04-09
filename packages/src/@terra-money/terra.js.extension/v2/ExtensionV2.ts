import { Network } from '@terra-dev/network';
import {
  ClientStatus,
  Status,
  TerraConnectClient,
} from '@terra-dev/terra-connect';
import { TerraConnectWebExtensionClient } from '@terra-dev/terra-connect-webextension';
import { serializeTx, Tx, TxStatus } from '@terra-dev/tx';
import { WalletInfo } from '@terra-dev/wallet';
import {
  Extension,
  Option,
  ResponseData,
  SendData,
  SendDataType,
} from '@terra-money/terra.js.extension/Extension';

type Callback = {
  callback: (payload: any) => void;
  once: boolean;
};

export class ExtensionV2 extends Extension {
  private readonly client!: TerraConnectClient;

  private _status: Status = { type: ClientStatus.INITIALIZING };
  private _network: Network = {
    name: 'mainnet',
    chainID: 'columbus-4',
    servers: {
      lcd: 'https://lcd.terra.dev',
      fcd: 'https://fcd.terra.dev',
      ws: 'wss://fcd.terra.dev',
      mantle: 'https://mantle.anchorprotocol.com/',
    },
  };
  private _wallets: WalletInfo[] | null = null;

  private infoCallbacks = new Set<Callback>();
  private connectCallbacks = new Set<Callback>();
  private postCallbacks = new Set<Callback>();

  private infoIds = new Set<number>();
  private connectIds = new Set<number>();
  private postIds = new Set<number>();

  constructor() {
    super();

    this.client = new TerraConnectWebExtensionClient(window);

    this.client.status().subscribe((status) => {
      this._status = status;
    });

    this.client.clientStates().subscribe((clientStates) => {
      if (clientStates) {
        this._network = clientStates.network;
        this._wallets = clientStates.wallets;

        const infoPayload = {
          name: clientStates.network.name,
          chainID: clientStates.network.chainID,
          lcd: clientStates.network.servers.lcd,
          fcd: clientStates.network.servers.fcd ?? '',
          ws: clientStates.network.servers.ws ?? '',
        };

        const connectPayload = {
          address:
            this._wallets.length > 0
              ? this._wallets[0].terraAddress
              : undefined,
        };

        for (const itemCallback of this.infoCallbacks) {
          itemCallback.callback(infoPayload);
          if (itemCallback.once) this.infoCallbacks.delete(itemCallback);
        }

        for (const itemCallback of this.connectCallbacks) {
          itemCallback.callback(connectPayload);
          if (itemCallback.once) this.connectCallbacks.delete(itemCallback);
        }
      }
    });
  }

  destroy() {
    this.client.destroy();
  }

  get isAvailable(): boolean {
    return this._status.type === ClientStatus.READY;
  }

  send(type: SendDataType, data?: SendData): number {
    const id = Date.now();

    switch (type) {
      case 'info':
        this.infoIds.add(id);
        this.client.refetchClientStates();
        break;
      case 'connect':
        this.connectIds.add(id);
        this.client.refetchClientStates();
        break;
      case 'post':
        if (!this._network || !this._wallets || this._wallets.length === 0) {
          return -1;
        }

        this.postIds.add(id);
        this.client
          .execute({
            network: this._network,
            terraAddress: this._wallets[0].terraAddress,
            tx: data as Tx,
          })
          .toPromise()
          .then((result) => {
            const payload =
              result.status === TxStatus.DENIED
                ? {
                    id,
                    ...serializeTx(data as Tx),
                    error: { code: 1 },
                    success: false,
                  }
                : result.status === TxStatus.SUCCEED
                ? {
                    id,
                    ...serializeTx(data as Tx),
                    result: result.payload,
                    success: true,
                  }
                : result.status === TxStatus.FAIL
                ? {
                    id,
                    ...serializeTx(data as Tx),
                    error: result.error,
                    success: false,
                  }
                : undefined;

            console.log('ExtensionV2.ts..()', payload);

            if (payload) {
              for (const itemCallback of this.postCallbacks) {
                itemCallback.callback(payload);
                if (itemCallback.once) this.postCallbacks.delete(itemCallback);
              }
            }
          })
          .catch((error) => {
            for (const itemCallback of this.postCallbacks) {
              itemCallback.callback({ error, id });
              if (itemCallback.once) this.postCallbacks.delete(itemCallback);
            }
          });
    }

    return id;
  }

  on(name: string, callback: (payload: any) => void): void;
  on(callback: (payload: any) => void): void;
  on(...args: any[]): void {
    if (typeof args[0] === 'string') {
      const callback = { callback: args[1], once: false };

      switch (args[0]) {
        case 'onInfo':
          this.infoCallbacks.add(callback);
          break;
        case 'onConnect':
          this.connectCallbacks.add(callback);
          break;
        case 'onPost':
          this.postCallbacks.add(callback);
          break;
      }
    } else {
      throw new Error(
        `Extension v2 does not support "extension.on(callback)". Please use like "extension.on('onInfo', callback)"`,
      );
    }
  }

  once(name: string, callback: (payload: any) => void): void;
  once(callback: (payload: any) => void): void;
  once(...args: any[]): void {
    if (typeof args[0] === 'string') {
      const callback = { callback: args[1], once: true };

      switch (args[0]) {
        case 'onInfo':
          this.infoCallbacks.add(callback);
          break;
        case 'onConnect':
          this.infoCallbacks.add(callback);
          break;
        case 'onPost':
          this.postCallbacks.add(callback);
          break;
      }
    } else {
      throw new Error(
        `Extension v2 does not support "extension.on(callback)". Please use like "extension.on('onInfo', callback)"`,
      );
    }
  }

  request(type: SendDataType, data?: SendData): Promise<ResponseData> {
    return new Promise<ResponseData>((resolve) => {
      this.once(type, resolve);
      this.send(type, data);
    });
  }

  /**
   * Request for sign and post to LCD server
   *
   * @return {string}  name                   'onPost'
   * @return {object}  payload
   * @return {number}  payload.id             identifier
   * @return {string}  payload.origin         origin address
   * @return {Msg[]}   payload.msgs           requested msgs
   * @return {boolean} payload.success
   * @return {number|undefined} payload.result.code
   *                                          error code. undefined with successful tx
   * @return {string}  payload.result.raw_log raw log
   * @return {string}  payload.result.txhash  transaction hash
   */
  post(options: Option): number {
    return this.send('post', options);
  }
}
