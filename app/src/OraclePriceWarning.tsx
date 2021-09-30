import { useWallet } from '@terra-dev/use-wallet';
import { useFlags } from 'contexts/flags';
import React from 'react';
import styled from 'styled-components';

export function OraclePriceWarning() {
  const { network } = useWallet();
  const { useExternalOraclePrice, oracleFeedResumeTime } = useFlags();

  return network.chainID.startsWith('columbus') && useExternalOraclePrice ? (
    <Container>
      Price oracle feed is expected to resume at{' '}
      <Word>{oracleFeedResumeTime}</Word>.
      <br />
      Operations requiring price oracle feed (Borrow / Withdraw Collateral) will
      resume at above time.
      <br />
      For more information, refer to our{' '}
      <a href="https://twitter.com/anchor_protocol/status/1438311757458534403?s=21">
        announcement
      </a>
      .
    </Container>
  ) : null;
}

const Word = styled.span`
  word-break: keep-all;
  white-space: nowrap;

  font-weight: 600;
`;

const Container = styled.div`
  text-align: center;

  padding: 15px;
  font-size: 13px;
  line-height: 1.4;

  background-color: #e7e769;
  color: black;
`;
