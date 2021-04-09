import { CreateTxOptions } from '@terra-money/terra.js';

export interface ResponseData {
  name: string;
  payload: object;
}

export type SendDataType = 'connect' | 'post' | 'sign' | 'info';

export interface SendData {
  [key: string]: any;
}

export interface Option extends CreateTxOptions {
  waitForConfirmation?: boolean; // default false
  purgeQueue?: boolean; // default true
}

export abstract class Extension {
  abstract destroy(): void;

  abstract get isAvailable(): boolean;

  abstract send(type: SendDataType, data?: SendData): number;

  abstract on(name: string, callback: (payload: any) => void): void;
  abstract on(callback: (payload: any) => void): void;

  abstract once(name: string, callback: (payload: any) => void): void;
  abstract once(callback: (payload: any) => void): void;

  abstract request(type: SendDataType, data?: SendData): Promise<ResponseData>;

  /**
   * Request to Station Extension for connecting a wallet
   *
   * @return {string}     name      'onConnect'
   * @return {AccAddress} payload   Terra account address
   */
  connect(): number {
    return this.send('connect');
  }

  /**
   * Request for Station Extension information
   *
   * @return {object}  payload.network
   * @return {string}  payload.network.name    Name of the network
   * @return {string}  payload.network.chainId Chain ID
   * @return {string}  payload.network.lcd     LCD address
   * @return {string}  payload.network.fcd     FCD address
   * @return {string}  payload.network.ws      Websocket address
   */
  info(): number {
    return this.send('info');
  }

  /**
   * Request for signing tx
   *
   * @return {string}  name               'onSign'
   * @return {object}  payload
   * @return {number}  payload.id         identifier
   * @return {string}  payload.origin     origin address
   * @return {Msg[]}   payload.msgs       requested msgs
   * @return {boolean} payload.success
   * @return {string}  payload.result.public_key Base64 encoded public key
   * @return {string}  payload.result.signature  Base64 encoded signature
   * @return {number}  payload.result.recid      Recovery id
   * @return {StdSignMsg.Data} payload.result.stdSignMsgData
   *
   * @example of broadcasting
   *
   * const { signature, public_key, recid, stdSignMsg } = payload.result;
   *
   * const sig = StdSignature.fromData({
   *   signature,
   *   pub_key: {
   *    type: 'tendermint/PubKeySecp256k1',
   *    value: public_key,
   *  },
   * });
   *
   * const stdSignMsg = StdSignMsg.fromData(payload.result.stdSignMsgData);
   * terra.tx.broadcast(new StdTx(stdSignMsg.msgs, stdSignMsg.fee, [sig], stdSignMsg.memo));
   */
  sign(options: Option): number {
    return this.send('sign', {
      ...options,
      msgs: options.msgs.map((msg) => msg.toJSON()),
      fee: options.fee?.toJSON(),
      memo: options.memo,
      gasPrices: options.gasPrices?.toString(),
      gasAdjustment: options.gasAdjustment?.toString(),
      account_number: options.account_number,
      sequence: options.sequence,
      waitForConfirmation: options.waitForConfirmation,
      purgeQueue: options.purgeQueue,
    });
  }

  abstract post(options: Option): number;
}
