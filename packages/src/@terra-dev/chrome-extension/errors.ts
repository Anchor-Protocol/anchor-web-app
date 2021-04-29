export class ChromeExtensionCreateTxFailed extends Error {}

export class ChromeExtensionTxFailed extends Error {
  constructor(public readonly txhash: string | undefined, message: string) {
    super(message);
  }
}

export class ChromeExtensionUnspecifiedError extends Error {}
