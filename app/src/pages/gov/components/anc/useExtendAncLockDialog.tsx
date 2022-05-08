import React from 'react';
import { useDialog, DialogProps, OpenDialog } from '@libs/use-dialog';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import type { ReactNode } from 'react';
import { ExtendAncLockDialogOuterProps } from './ExtendAncLockDialog';
import { TerraExtendAncLockDialog } from './terra';
import { EvmExtendAncLockDialog } from './evm';

function Component(props: DialogProps<ExtendAncLockDialogOuterProps>) {
  return (
    <DeploymentSwitch
      terra={<TerraExtendAncLockDialog {...props} />}
      ethereum={<EvmExtendAncLockDialog {...props} />}
    />
  );
}

export function useExtendAncLockDialog(): [
  OpenDialog<ExtendAncLockDialogOuterProps>,
  ReactNode,
] {
  return useDialog<ExtendAncLockDialogOuterProps>(Component);
}
