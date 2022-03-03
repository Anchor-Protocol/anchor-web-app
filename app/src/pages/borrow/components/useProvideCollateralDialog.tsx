import { OpenDialog, useDialog, DialogProps } from '@libs/use-dialog';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import React, { ReactNode } from 'react';
import { TerraProvideCollateralDialog } from './terra/TerraProvideCollateralDialog';
import { ProvideCollateralFormParams } from './types';

function Component(props: DialogProps<ProvideCollateralFormParams>) {
  return (
    <DeploymentSwitch
      terra={<TerraProvideCollateralDialog {...props} />}
      ethereum={<TerraProvideCollateralDialog {...props} />}
    />
  );
}

export function useProvideCollateralDialog(): [
  OpenDialog<ProvideCollateralFormParams>,
  ReactNode,
] {
  return useDialog<ProvideCollateralFormParams>(Component);
}
