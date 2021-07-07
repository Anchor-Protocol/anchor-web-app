import { ShieldPlus } from '@anchor-protocol/icons';
import { ButtonBaseProps } from '@material-ui/core';
import { TextButton } from '@terra-dev/neumorphism-ui/components/TextButton';
import React from 'react';
import { useInsuranceCoverageDialog } from './useInsuranceCoverageDialog';

export function InsuranceCoverageButton(buttonProps: ButtonBaseProps) {
  const [openInsuranceCoverage, insuranceCoverageElement] =
    useInsuranceCoverageDialog();

  return (
    <>
      <TextButton
        {...buttonProps}
        style={{ padding: '0 15px' }}
        onClick={() => openInsuranceCoverage({})}
      >
        <ShieldPlus
          style={{ fontSize: '1em', transform: 'scale(1.2)', marginRight: 8 }}
        />{' '}
        Get Insurance Coverage
      </TextButton>
      {insuranceCoverageElement}
    </>
  );
}
