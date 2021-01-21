export class OperationTimeoutError extends Error {
  constructor() {
    super();
    this.name = 'OperationTimeoutError';
  }
}

export class OperationAbort extends Error {
  constructor() {
    super();
    this.name = 'Abort';
  }
}
