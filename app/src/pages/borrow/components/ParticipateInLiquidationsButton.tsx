import { ParticipateInLiquidations } from '@anchor-protocol/icons';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { ButtonBaseProps } from '@material-ui/core';
import { useParticipateInLiquidationsDialog } from 'pages/borrow/components/useParticipateInLiquidationsDialog';
import React from 'react';
import styled from 'styled-components';

export function ParticipateInLiquidationsButton(buttonProps: ButtonBaseProps) {
  const [openParticipateInLiquidations, participateInLiquidationsElement] =
    useParticipateInLiquidationsDialog();

  return (
    <>
      <Button
        {...buttonProps}
        onClick={() => openParticipateInLiquidations({})}
      >
        <ParticipateInLiquidations /> Participate in Liquidations
      </Button>
      {participateInLiquidationsElement}
    </>
  );
}

const Button = styled(BorderButton)`
  padding: 0 10px;

  border: none !important;

  font-size: 16px;
  height: 34px;

  svg {
    font-size: 1em;
    transform: scale(1.2);
    margin-right: 8px;
  }
`;
