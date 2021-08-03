import { DollarCoin } from '@anchor-protocol/icons';
import { ButtonBaseProps } from '@material-ui/core';
import { TextButton } from '@terra-dev/neumorphism-ui/components/TextButton';
import { useBuyUstDialog } from 'pages/earn/components/useBuyUstDialog';
import React from 'react';

export function BuyUstButton(buttonProps: ButtonBaseProps) {
  const [openBuyUst, buyUstElement] = useBuyUstDialog();

  return (
    <>
      <TextButton
        {...buttonProps}
        style={{ padding: '0 15px' }}
        onClick={() => openBuyUst({})}
      >
        <DollarCoin
          style={{ fontSize: '1em', transform: 'scale(1.2)', marginRight: 8 }}
        />{' '}
        Buy UST
      </TextButton>
      {buyUstElement}
    </>
  );
}
