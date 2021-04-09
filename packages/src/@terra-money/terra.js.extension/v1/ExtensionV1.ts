import {
  Extension,
  Option,
  ResponseData,
  SendData,
  SendDataType,
} from '@terra-money/terra.js.extension/Extension';
import PostMessageStream from './PostMessageStream';

/**
 * Extension class is for communicating between page and extension
 */
export class ExtensionV1 extends Extension {
  static instance: ExtensionV1;
  private readonly inpageStream!: PostMessageStream;

  /**
   * Using singleton pattern, hence every instanciation will return same value
   */
  constructor() {
    if (ExtensionV1.instance) {
      return ExtensionV1.instance;
    }

    super();

    ExtensionV1.instance = this;

    this.inpageStream = new PostMessageStream({
      name: 'station:inpage',
      target: 'station:content',
    });
  }

  destroy() {
    this.inpageStream && this.inpageStream.destroy();
  }

  private generateId(): number {
    return Date.now();
  }

  /**
   * Indicates the Station Extension is installed and availble (requires extension v1.1 or later)
   */
  get isAvailable(): boolean {
    return !!window.isTerraExtensionAvailable;
  }

  /**
   * low level function for sending message to extension.
   * Do not use this function unless you know what you are doing.
   */
  send(type: SendDataType, data?: SendData): number {
    const id = this.generateId();

    this.inpageStream.write({
      ...data,
      id,
      type,
    });

    return id;
  }

  /**
   * Listen to events from the Extension.
   * You will receive an event after calling connect, sign, or post.
   * payload structures are described on each function in @return section.
   *
   * @param name name of event (optional)
   * @param callback will be called when `name` or any event emits
   */
  on(name: string, callback: (payload: any) => void): void;
  on(callback: (payload: any) => void): void;
  on(...args: any[]): void {
    this.inpageStream.on('data', (data: ResponseData) => {
      if (typeof args[0] === 'string') {
        data.name === args[0] && args[1](data.payload, data.name);
      } else {
        args[0](data.payload, data.name);
      }
    });
  }

  /**
   * Listen to an event from the Extension once.
   * You will receive an event after calling each type of messages.
   * payload structures are described on each function in @return section.
   *
   * @param name name of event (optional)
   * @param callback will be called when `name` or any event emits
   */
  once(name: string, callback: (payload: any) => void): void;
  once(callback: (payload: any) => void): void;
  once(...args: any[]): void {
    this.inpageStream.once('data', (data: ResponseData) => {
      if (typeof args[0] === 'string') {
        data.name === args[0] && args[1](data.payload, data.name);
      } else {
        args[0](data.payload, data.name);
      }
    });
  }

  /**
   * Send a request
   *
   * @param {SendDataType} type
   * @param {SendData} data
   */
  async request(type: SendDataType, data?: SendData): Promise<ResponseData> {
    this.send(type, data);

    return new Promise((resolve) => {
      this.inpageStream.once('data', resolve);
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
    return this.send('post', {
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
}
