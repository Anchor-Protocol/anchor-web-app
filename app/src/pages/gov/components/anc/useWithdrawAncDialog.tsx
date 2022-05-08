import React from 'react';
import { useDialog, DialogProps, OpenDialog } from '@libs/use-dialog';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import type { ReactNode } from 'react';
import { WithdrawAncDialogOuterProps } from './WithdrawAncDialog';
import { TerraWithdrawAncDialog } from './terra';
import { EvmWithdrawAncDialog } from './evm';

function Component(props: DialogProps<WithdrawAncDialogOuterProps>) {
  return (
    <DeploymentSwitch
      terra={<TerraWithdrawAncDialog {...props} />}
      ethereum={<EvmWithdrawAncDialog {...props} />}
    />
  );
}

export function useWithdrawAncDialog(): [
  OpenDialog<WithdrawAncDialogOuterProps>,
  ReactNode,
] {
  return useDialog<WithdrawAncDialogOuterProps>(Component);
}
