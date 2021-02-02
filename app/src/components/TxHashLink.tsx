import { truncate } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';

export interface TxHashProps {
  txHash: string;
}

export function TxHashLink({ txHash }: TxHashProps) {
  const { status } = useWallet();

  return (
    <a
      href={`https://finder.terra.money/${status.network.chainID}/tx/${txHash}`}
      target="_blank"
      rel="noreferrer"
    >
      {truncate(txHash)}
    </a>
  );
}
