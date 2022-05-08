import React from 'react';
import { useDialog, DialogProps, OpenDialog } from '@libs/use-dialog';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import type { ReactNode } from 'react';
import { LockAncDialogOuterProps } from './LockAncDialog';
import { TerraLockAncDialog } from './terra';
import { EvmLockAncDialog } from './evm';

function Component(props: DialogProps<LockAncDialogOuterProps>) {
  return (
    <DeploymentSwitch
      terra={<TerraLockAncDialog {...props} />}
      ethereum={<EvmLockAncDialog {...props} />}
    />
  );
}

export function useLockAncDialog(): [
  OpenDialog<LockAncDialogOuterProps>,
  ReactNode,
] {
  return useDialog<LockAncDialogOuterProps>(Component);
}
