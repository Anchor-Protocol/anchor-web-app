import { anchorToken } from '@anchor-protocol/types';
import { useContract, useContractNickname } from 'base/contexts/contract';
import { AccountLink } from 'components/AccountLink';
import { getMsgDetails } from '../logics/getMsgDetails';
import React, { Fragment, useMemo } from 'react';

export interface PollMsgRendererProps {
  msg: anchorToken.gov.ParsedExecuteMsg | null | undefined;
}

export function PollMsgRenderer({ msg }: PollMsgRendererProps) {
  const { address } = useContract();
  const nickname = useContractNickname();

  const contractNickname = useMemo(
    () => (msg?.contract ? nickname(msg.contract) : ''),
    [msg?.contract, nickname],
  );

  if (!msg) {
    return null;
  }

  return (
    <>
      <article>
        <h4>Contract</h4>
        <p>
          {contractNickname.length > 0 ? (
            <>
              {contractNickname}
              <br />
            </>
          ) : null}
          <AccountLink address={msg.contract} />
        </p>
      </article>

      <article>
        {getMsgDetails(address, msg).map(({ name, value }) => (
          <Fragment key={name}>
            <h4>{name}</h4>
            <p>{value}</p>
          </Fragment>
        ))}
      </article>
    </>
  );
}
