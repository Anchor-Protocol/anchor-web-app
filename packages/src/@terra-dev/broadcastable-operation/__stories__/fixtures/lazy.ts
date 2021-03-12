export function lazy<T>(v: T, ms: number = 100) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(v), ms));
}
