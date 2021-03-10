import { ParsedExecuteMsg } from '@anchor-protocol/types/contracts/anchorToken/gov';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { useContractName } from '@anchor-protocol/web-contexts/contexts/contract';
import React from 'react';
import styled from 'styled-components';

export interface PollMsgRendererProps {
  msg: ParsedExecuteMsg | null | undefined;
}

export function PollMsgRenderer({ msg }: PollMsgRendererProps) {
  const { status } = useWallet();

  const contractName = useContractName();

  if (!msg) {
    return <div>Empty Msg</div>;
  }

  return (
    <ul style={{ border: '1px solid black' }}>
      <li>
        Contract:{' '}
        <a
          href={`https://finder.terra.money/${status.network.chainID}/account/${msg.contract}`}
          target="_blank"
          rel="noreferrer"
        >
          {contractName(msg.contract)}
        </a>
      </li>
      <li>
        <pre>{JSON.stringify(msg.msg, null, 2)}</pre>
      </li>
    </ul>
  );
}

export const PollMsgRendererContainer = styled.div``;
