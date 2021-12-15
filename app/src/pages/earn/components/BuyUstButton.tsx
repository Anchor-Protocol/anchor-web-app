import { DollarCoin } from '@anchor-protocol/icons';
import { ButtonBaseProps } from '@material-ui/core';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { useBuyUstDialog } from 'pages/earn/components/useBuyUstDialog';
import React from 'react';
import styled from 'styled-components';

export function BuyUstButton(buttonProps: ButtonBaseProps) {
  const [openBuyUst, buyUstElement] = useBuyUstDialog();

  return (
    <>
      <Button {...buttonProps} onClick={() => openBuyUst({})}>
        <DollarCoin /> Buy UST
      </Button>
      {buyUstElement}
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
