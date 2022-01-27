import { cw20, Token } from '@libs/types';

const isWormhole = /\(wormhole\)/i;

/**
 * Correct the terrible registered cw20 symbol information by hard coding
 */
export function prettifySymbol(
  cw20SymbolName: string,
  info?: cw20.TokenInfoResponse<Token>,
): string {
  if (!!info && isWormhole.test(info.name)) {
    switch (cw20SymbolName.toLowerCase()) {
      case 'beth':
        return 'webETH';
    }
  }

  switch (cw20SymbolName) {
    case 'BLUNA':
      return 'bLUNA';
    case 'BETH':
      return 'bETH';
  }

  return cw20SymbolName;
}
