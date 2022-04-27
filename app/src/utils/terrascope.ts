const getTerrascopeUrl = (chainId: string) => `https://terrasco.pe/${chainId}`;

export const getTransactionDetailUrl = (
  chainId: string,
  transactionHash: string,
) => `${getTerrascopeUrl(chainId)}/tx/${transactionHash}`;

export const getAccountUrl = (chainId: string, address: string) =>
  `${getTerrascopeUrl(chainId)}/address/${address}`;

export const getBlockUrl = (chainId: string, blockHeight: number) =>
  `${getTerrascopeUrl(chainId)}/blocks/${blockHeight}`;
