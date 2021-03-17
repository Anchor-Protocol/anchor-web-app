export class OperationTimeoutError extends Error {
  constructor() {
    super();
    this.name = 'OperationTimeoutError';
  }
}

export class OperationStop extends Error {
  constructor() {
    super();
    this.name = 'OperationStop';
  }
}
