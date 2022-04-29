import { formatVeAnc } from '@anchor-protocol/notation';
import { VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { ANC, veANC } from '@anchor-protocol/types';
import { Second } from '@libs/types';
import { BigSource } from 'big.js';
import React from 'react';
import styled from 'styled-components';

interface ExpectedVeAncToReceiveProps {
  boostCoefficient: number;
  period: Second;
  maxLockTime: Second;
  amount: ANC;
}

export const ExpectedVeAncToReceive = ({
  boostCoefficient,
  period,
  maxLockTime,
  amount,
}: ExpectedVeAncToReceiveProps) => {
  const veAncAmount =
    ((boostCoefficient * period) / maxLockTime) * Number(amount);
  return (
    <Container>
      Receive ~ {formatVeAnc(veAncAmount as veANC<BigSource>)} {VEANC_SYMBOL}
    </Container>
  );
};

const Container = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.dimTextColor};
`;
