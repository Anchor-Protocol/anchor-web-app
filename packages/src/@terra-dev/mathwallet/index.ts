export function isMathWallet(userAgent: string) {
  return /MathWallet\//.test(userAgent);
}
