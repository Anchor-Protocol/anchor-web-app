interface HiveFetchErrorItem {
  message: string;
  locations: Array<{ line: number; column: number }>;
  path: Array<string>;
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
