export class WalletConnectUserDenied extends Error {}

export class WalletConnectCreateTxFailed extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletConnectCreateTxFailed';
  }
}

export class WalletConnectTxFailed extends Error {
  constructor(
    public readonly txhash: string,
    message: string,
    public readonly raw_message: any,
  ) {
    super(message);
    this.name = 'WalletConnectTxFailed';
  }
}

export class WalletConnectTimeout extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletConnectTimeout';
  }
}

export class WalletConnectTxUnspecifiedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletConnectTxUnspecifiedError';
  }
}
