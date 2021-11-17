export interface HiveFetchErrorItem {
  message: string;
  locations: Array<{ line: number; column: number }>;
  path: Array<string>;
}

export class LcdFault extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LcdFault';
  }

  toString = () => {
    return `[${this.name} message="${this.message}"]`;
  };
}

export class LcdFetchError extends Error {
  constructor(
    readonly code: number,
    readonly txhash: string,
    readonly raw_log: string,
  ) {
    super(raw_log);
    this.name = 'LcdFetchError';
  }

  toString = () => {
    return `[${this.name} code="${this.code}" txhash="${this.txhash}" raw_log="${this.raw_log}"]`;
  };
}

export class HiveFetchError extends Error {
  constructor(public readonly errors: HiveFetchErrorItem[]) {
    super(
      errors
        .map(({ message, path }, i) => `${i} [${path.join(', ')}]: ${message}`)
        .join('\n'),
    );
    this.name = 'HiveFetchError';
  }

  toString = () => {
    return `[${this.name}]\n${this.message}`;
  };
}
