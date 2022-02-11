import React from 'react';
import type { DialogProps } from '@libs/use-dialog';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import { EvmDepositDialog } from './EvmDepositDialog';
import { TerraDepositDialog } from './TerraDepositDialog';
import { FormParams, FormReturn } from './types';

export function DepositDialog({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  return (
    <DeploymentSwitch
      terra={
        <TerraDepositDialog className={className} closeDialog={closeDialog} />
      }
      ethereum={
        <EvmDepositDialog className={className} closeDialog={closeDialog} />
      }
    />
  );
}
