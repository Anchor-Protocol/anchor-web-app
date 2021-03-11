export function isZero(
  x: string | number | { toString: () => string },
): boolean {
  try {
    return typeof x === 'string'
      ? +x === 0
      : typeof x === 'number'
      ? x === 0
      : +x.toString() === 0;
  } catch {
    return true;
  }
}
