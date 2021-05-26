export enum ChromeExtensionStatus {
  INITIALIZING = 'INITIALIZING',
  // can't using extension api
  UNAVAILABLE = 'UNAVAILABLE',
  // can using extension api, but not connected
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  // session connected
  WALLET_CONNECTED = 'WALLET_CONNECTED',
}
