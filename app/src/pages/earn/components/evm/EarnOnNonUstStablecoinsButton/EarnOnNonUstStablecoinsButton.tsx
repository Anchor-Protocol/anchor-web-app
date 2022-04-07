import { ButtonBaseProps } from '@material-ui/core';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import React from 'react';
import styled from 'styled-components';
import { OrionIcon } from './OrionIcon';
import { useEarnOnNonUstStablecoinsDialog } from './useEarnOnNonUstStablecoinsDialog';

export function EarnOnNonUstStablecoinsButton(buttonProps: ButtonBaseProps) {
  const [openDialog, dialogElement] = useEarnOnNonUstStablecoinsDialog();

  return (
    <>
      <Button {...buttonProps} onClick={() => openDialog({})}>
        <OrionIcon />
        <span>Earn on Non-UST Stablecoins</span>
      </Button>
      {dialogElement}
    </>
  );
}

const Button = styled(BorderButton)`
  height: initial;
  padding: 7px 10px;
  border: none !important;
  font-size: 16px;
  line-height: 20px;

  svg {
    font-size: 1em;
    transform: scale(1.2);
    margin-right: 8px;
  }

  @media (min-width: 701px) and (max-width: 1050px) {
    max-width: 190px;
  }
`;
