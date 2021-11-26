import { useLocalStorageJson } from '@libs/use-local-storage';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import big from 'big.js';
import {
  SlippageSelector,
  SlippageSelectorProps,
} from 'components/SlippageSelector';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface DiscloseSlippageSelectorProps extends SlippageSelectorProps {}

function Component({
  className,
  value,
  ...selectorProps
}: DiscloseSlippageSelectorProps) {
  const [{ open }, setOpen] = useLocalStorageJson<{ open: boolean }>(
    '__anchor_slippage__',
    () => ({ open: false }),
  );

  return (
    <details className={className} {...(open ? { open: true } : {})}>
      <summary
        onClick={(event) => {
          event.preventDefault();
          setOpen({ open: !open });
        }}
      >
        {open ? <ExpandLess /> : <ExpandMore />}
        Slippage Tolerance: {big(value).mul(100).toFixed()}%
      </summary>

      <SlippageSelector value={value} {...selectorProps} className="selector" />
    </details>
  );
}

const StyledComponent = styled(Component)`
  summary {
    font-size: 13px;
    line-height: 1.2;

    user-select: none;
    cursor: pointer;

    svg {
      font-size: 1em;
      transform: scale(1.3) translateY(0.1em);
      margin-right: 0.3em;
    }
  }

  summary::marker {
    content: '';
  }

  .selector {
    margin-top: 10px;
  }
`;

export const DiscloseSlippageSelector = fixHMR(StyledComponent);
