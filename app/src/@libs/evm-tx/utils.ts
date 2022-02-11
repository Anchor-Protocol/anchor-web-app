import { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { TxReceipt } from '@libs/app-fns';
import { ChainId } from '@libs/evm-wallet';

const decimals = 6; // TODO: move to config

// TODO: microfy/demicrofy?
export function fromWei(value: BigNumberish): string {
  return formatUnits(value, decimals);
}

// TODO: microfy/demicrofy?
export function toWei(value: BigNumberish): string {
  return parseUnits(String(value), decimals).toString();
}

export function getTxHashReceipt(
  txHash?: string,
  chainId?: number | string,
): TxReceipt | null {
  if (!chainId || !txHash) {
    return null;
  }

  const host =
    chainId === ChainId.ETHEREUM_TESTNET
      ? 'ropsten.etherscan.io'
      : 'etherscan.io';

  const html = `<a href="https://${host}/tx/${txHash}" target="_blank" rel="noreferrer">${txHashTruncate(
    txHash,
  )}</a>`;

  return {
    name: 'Tx Hash',
    value: {
      html,
    },
  };
}

function txHashTruncate(
  txHash: string = '',
  [h, t]: [number, number] = [6, 6],
): string {
  const head = txHash.slice(0, h);
  const tail = txHash.slice(-1 * t, txHash.length);

  return txHash.length > h + t ? [head, tail].join('...') : txHash;
}
