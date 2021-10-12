import { anchorToken } from '@anchor-protocol/types';
import {
  useAnchorWebapp,
  useContractNickname,
} from '@anchor-protocol/app-provider';
import { AccountLink } from 'components/links/AccountLink';
import React, { Fragment, useMemo } from 'react';
import { getMsgDetails } from '../logics/getMsgDetails';

export interface PollMsgRendererProps {
  msg: anchorToken.gov.ParsedExecuteMsg | null | undefined;
}

export function PollMsgRenderer({ msg }: PollMsgRendererProps) {
  const { contractAddress: address } = useAnchorWebapp();
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
