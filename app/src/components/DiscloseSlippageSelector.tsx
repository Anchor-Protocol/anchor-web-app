import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import big from 'big.js';
import {
  SlippageSelector,
  SlippageSelectorProps,
} from 'components/SlippageSelector';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import { useLocalStorage } from 'usehooks-ts';
import styled from 'styled-components';

export interface DiscloseSlippageSelectorProps extends SlippageSelectorProps {}

function Component({
  className,
  value,
  ...selectorProps
}: DiscloseSlippageSelectorProps) {
  const [{ open }, setOpen] = useLocalStorage<{ open: boolean }>(
    '__anchor_slippage__',
    { open: false },
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
        <IconSpan>
          Slippage Tolerance{' '}
          <InfoTooltip>
            The transaction will revert if the price changes by more than the
            defined percentage.{' '}
          </InfoTooltip>
          : {big(value).mul(100).toFixed()}%
        </IconSpan>
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
