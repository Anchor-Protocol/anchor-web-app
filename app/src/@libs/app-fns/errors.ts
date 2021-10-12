export class PollingTimeout extends Error {
  constructor(message: string, readonly txhash: string) {
    super(message);
    this.name = 'PollingTimeout';
  }

  toString = () => {
    return `[${this.name} txhash="${this.txhash}" message="${this.message}"]`;
  };
}
