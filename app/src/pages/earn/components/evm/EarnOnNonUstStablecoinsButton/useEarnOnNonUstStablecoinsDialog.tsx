import { Modal } from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { EmbossButton } from '@libs/neumorphism-ui/components/EmbossButton';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import busd from './busd.svg';
import dai from './dai.svg';
import usdc from './usdc.svg';
import usdt from './usdt.svg';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useEarnOnNonUstStablecoinsDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

const tokens = [
  { name: 'USD Coin', image: usdc },
  { name: 'Tether', image: usdt },
  { name: 'Binance USD', image: busd },
  { name: 'DAI', image: dai },
];

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Earn on Non-UST Stablecoins</h1>

        {tokens.map(({ name, image }) => (
          <EmbossButton
            key={name}
            component="a"
            href="https://app.orion.money/"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              {name}&nbsp;
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={image} alt={name} />
            </i>
          </EmbossButton>
        ))}
      </Dialog>
    </Modal>
  );
}

export const dialogStyle = css`
  h1 {
    font-size: 24px;
    text-align: center;
    font-weight: 300;
    margin-bottom: 41px;
    letter-spacing: -0.5px;
  }

  h2 {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.dimTextColor};
    margin-bottom: 8px;
    line-height: 1;
  }

  section:first-of-type {
    margin-bottom: 32px;
  }

  a {
    width: 100%;
    height: 60px;
    font-size: 16px;
    padding: 0 37px 0 27px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      sub {
        vertical-align: bottom;
        font-size: 1ex;

        svg {
          font-size: 1em;
          color: ${({ theme }) => theme.dimTextColor};
          transform-origin: bottom;
          transform: scale(1.5) translateX(0.1em);
        }
      }
    }

    i {
      width: 40px;
      text-align: center;
      transform: translateY(1px);
    }

    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }
`;

const Component = styled(ComponentBase)`
  width: 458px;

  ${dialogStyle};
`;
