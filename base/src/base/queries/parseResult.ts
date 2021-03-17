export type WithResult<T extends {}> = { Result: string } & T;

export function parseResult<T extends { Result: string }>(
  prev: T | undefined,
  Result: string,
): T {
  return prev?.Result === Result ? prev : { Result, ...JSON.parse(Result) };
}
