import { ParsedExecuteMsg } from '@anchor-protocol/types/contracts/anchorToken/gov';
import { useContractNickname } from '@anchor-protocol/web-contexts/contexts/contract';
import { AccountLink } from 'components/AccountLink';
import { getMsgDetails } from 'pages/gov/logics/getMsgDetails';
import React, { Fragment } from 'react';
import styled from 'styled-components';

export interface PollMsgRendererProps {
  msg: ParsedExecuteMsg | null | undefined;
}

export function PollMsgRenderer({ msg }: PollMsgRendererProps) {
  const nickname = useContractNickname();

  if (!msg) {
    return null;
  }

  return (
    <>
      <article>
        <h4>Contract</h4>
        <p>
          {nickname(msg.contract)} <AccountLink address={msg.contract} />
        </p>
      </article>

      <article>
        {getMsgDetails(msg).map(({ name, value }) => (
          <Fragment key={name}>
            <h4>{name}</h4>
            <p>{value}</p>
          </Fragment>
        ))}
      </article>
    </>
  );
}

export const PollMsgRendererContainer = styled.div``;
