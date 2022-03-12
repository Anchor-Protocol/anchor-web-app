import { Chain } from '@anchor-protocol/app-provider';

export const enum Mode {
  Light = 'light',
  Dark = 'dark',
}

export const themeBuilder = (chain: Chain, mode: Mode) => {
  if (mode === Mode.Light) {
    switch (chain) {
      case Chain.Avalanche:
        return {};
      case Chain.Terra:
        return {};
      case Chain.Ethereum:
        return {};
      default:
        return {};
    }
  } else {
    switch (chain) {
      case Chain.Avalanche:
        return {};
      case Chain.Terra:
        return {};
      case Chain.Ethereum:
        return {};
      default:
        return {};
    }
  }
};
