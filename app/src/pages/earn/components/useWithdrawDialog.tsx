import type { ReactNode } from 'react';
import React from 'react';
import type { DialogProps, OpenDialog } from '@libs/use-dialog';
import { useDialog } from '@libs/use-dialog';
import { FormParams, FormReturn } from './types';
import { TerraWithdrawDialog } from './terra';
import { EvmWithdrawDialog } from './evm';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';

function Component(props: DialogProps<FormParams, FormReturn>) {
  return (
    <DeploymentSwitch
      terra={<TerraWithdrawDialog {...props} />}
      ethereum={<EvmWithdrawDialog {...props} />}
    />
  );
}

export function useWithdrawDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog<FormParams, FormReturn>(Component);
}
