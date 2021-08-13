import { createSvgIcon, SvgIcon } from '@material-ui/core';
import { ComponentType, createElement } from 'react';

export function createMaterialIcon(Icon: ComponentType): typeof SvgIcon {
  return createSvgIcon(
    createElement(Icon),
    Icon.displayName || 'OPTControlIcon',
  );
}
