interface MantleErrorItem {
  message: string;
  locations: Array<{ line: number; column: number }>;
  path: Array<string>;
}

export class MantleError extends Error {
  constructor(public readonly errors: MantleErrorItem[]) {
    super(
      errors
        .map(({ message, path }, i) =>
          path ? `${i} [${path.join(', ')}]: ${message}` : '',
        )
        .join('\n'),
    );
    console.log('errors.ts..constructor()', errors);
    this.name = 'MantleError';
  }

  toString = () => {
    return `[${this.name}]\n${this.message}`;
  };
}
