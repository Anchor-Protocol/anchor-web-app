import { OpenDialog, useDialog, DialogProps } from '@libs/use-dialog';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import React, { ReactNode } from 'react';
import { EvmRedeemCollateralDialog } from './evm/EvmRedeemCollateralDialog';
import { TerraRedeemCollateralDialog } from './terra/TerraRedeemCollateralDialog';
import { RedeemCollateralFormParams } from './types';

function Component(props: DialogProps<RedeemCollateralFormParams>) {
  return (
    <DeploymentSwitch
      terra={<TerraRedeemCollateralDialog {...props} />}
      ethereum={<EvmRedeemCollateralDialog {...props} />}
    />
  );
}

export function useRedeemCollateralDialog(): [
  OpenDialog<RedeemCollateralFormParams>,
  ReactNode,
] {
  return useDialog<RedeemCollateralFormParams>(Component);
}
