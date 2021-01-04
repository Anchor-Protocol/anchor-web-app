export type WalletStatus =
  | { status: 'initializing' }
  | { status: 'not_installed' }
  | { status: 'not_connected' }
  | { status: 'ready'; address: string };
