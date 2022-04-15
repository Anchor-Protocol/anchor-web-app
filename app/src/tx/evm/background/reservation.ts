export class TxReservation {
  private reserveAfter: number = Math.random() * 10000;
  public promise: Promise<boolean>;
  private resolve?: (val: boolean) => void;

  constructor() {
    this.promise = new Promise((res) => {
      this.resolve = res;
    });

    setTimeout(() => {
      this.resolve?.(true);
    }, this.reserveAfter);
  }

  public async take(): Promise<boolean> {
    return this.promise;
  }

  public async free(): Promise<boolean> {
    this.resolve?.(false);
    return this.promise;
  }
}
