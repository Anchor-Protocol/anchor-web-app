import { ShieldPlus } from '@anchor-protocol/icons';
import { ButtonBaseProps } from '@material-ui/core';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import React from 'react';
import styled from 'styled-components';
import { useInsuranceCoverageDialog } from './useInsuranceCoverageDialog';

export function InsuranceCoverageButton(buttonProps: ButtonBaseProps) {
  const [openInsuranceCoverage, insuranceCoverageElement] =
    useInsuranceCoverageDialog();

  return (
    <>
      <Button {...buttonProps} onClick={() => openInsuranceCoverage({})}>
        <ShieldPlus /> Protect Your Deposit
      </Button>
      {insuranceCoverageElement}
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
