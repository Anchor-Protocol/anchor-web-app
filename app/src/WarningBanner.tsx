import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

export function WarnningBanner() {
  const match = useRouteMatch('/gov');

  return !!match ? (
    <Container>
      Due to the Columbus-5 mainnet upgrade, we are reindexing data shown on the
      webapp.
      <br />
      The values such as APR are subject to higher volatility and may be
      incorrect as there are less data samples.
      <br /> Values will smooth out and return to normal once the reindexing has
      been complete.
    </Container>
  ) : null;
}

//const Word = styled.span`
//  word-break: keep-all;
//  white-space: nowrap;
//  font-weight: 600;
//`;

const Container = styled.div`
  text-align: center;
  padding: 15px;
  font-size: 13px;
  line-height: 1.4;
  background-color: #e7e769;
  color: black;
`;
