import { truncate } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider2';

export interface TxHashProps {
  txHash: string;
}

export function TxHashLink({ txHash }: TxHashProps) {
  const { network } = useWallet();

  return (
    <a
      href={`https://finder.terra.money/${network.chainID}/tx/${txHash}`}
      target="_blank"
      rel="noreferrer"
    >
      {truncate(txHash)}
    </a>
  );
}
