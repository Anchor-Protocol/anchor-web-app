import { Tokens } from '@anchor-protocol/token-icons';

export function symbolToTokenIcon(symbol: string): Tokens {
  switch (symbol) {
    case 'webETH':
      return 'wheth';
    case 'bETH':
      return 'beth';
  }

  return 'luna';
}
