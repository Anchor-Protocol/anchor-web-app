export function parseResult<T extends { Result: string }>(
  prev: T | undefined,
  Result: string,
): T {
  return prev?.Result === Result ? prev : { Result, ...JSON.parse(Result) };
}
