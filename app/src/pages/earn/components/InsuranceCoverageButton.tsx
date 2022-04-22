import { ShieldPlus } from '@anchor-protocol/icons';
import { ButtonBaseProps } from '@material-ui/core';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import React from 'react';
import styled from 'styled-components';
import { useInsuranceCoverageDialog } from './useInsuranceCoverageDialog';

interface InsuranceCoverageButtonProps extends ButtonBaseProps {
  useManualWidthOnMobile?: boolean;
}

export function InsuranceCoverageButton({
  useManualWidthOnMobile = false,
  ...buttonProps
}: InsuranceCoverageButtonProps) {
  const [openInsuranceCoverage, insuranceCoverageElement] =
    useInsuranceCoverageDialog();

  return (
    <>
      <Button
        {...buttonProps}
        className={useManualWidthOnMobile && 'manualWidth'}
        onClick={() => openInsuranceCoverage({})}
      >
        <ShieldPlus /> Protect Your Deposit
      </Button>
      {insuranceCoverageElement}
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
    &.manualWidth {
      max-width: 145px;
      flex-shrink: 0;
    }
  }
`;
