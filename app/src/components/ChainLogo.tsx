import React from 'react';
import LogoAvax from './Header/assets//LogoAvax.svg';
import LogoEth from './Header/assets/LogoEth.svg';
import LogoTerra from './Header/assets//LogoTerra.svg';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import { UIElementProps } from '@libs/ui';

export const ChainLogo = (props: UIElementProps) => {
  const { className } = props;
  return (
    <DeploymentSwitch
      terra={() => (
        <img className={className} src={LogoTerra} alt="terraLogo" />
      )}
      ethereum={() => <img className={className} src={LogoEth} alt="ethLogo" />}
      avalanche={() => (
        <img className={className} src={LogoAvax} alt="avaxLogo" />
      )}
    />
  );
};
