export function toAmount(amount: number): string[] {
  const punctured = punctureAmount(amount);
  return [punctured[0], padAmount(punctured[1])];
}

export function punctureAmount(amount: number): string[] {
  const sp = (amount / 1000000).toFixed(6).toString().split('.');
  console.log((amount / 1000000).toFixed(6).toString());
  if (sp.length !== 2) {
    throw new Error('Invalid amount');
  }

  return sp;
}

export function padAmount(dec: string): string {
  return dec.padEnd(6, '0');
}
