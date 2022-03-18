import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { EmbossButton } from '@libs/neumorphism-ui/components/EmbossButton';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import kujira from './assets/kujira.png';
import lighthouse from './assets/lighthouse.png';
import freewilly from './assets/freewilly.png';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useParticipateInLiquidationsDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Participate in Liquidations</h1>

        <section>
          <EmbossButton
            component="a"
            href="https://app.lighthousedefi.com/"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              Lighthouse Defi{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={lighthouse} alt="Lighthouse Defi" />
            </i>
          </EmbossButton>
          <EmbossButton
            component="a"
            href="https://orca.kujira.app/"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              Kujira{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={kujira} alt="Kujira" />
            </i>
          </EmbossButton>

          <EmbossButton
            component="a"
            href="https://www.terratoolbox.com/freewilly"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              Terra Toolbox{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={freewilly} alt="Terra Toolbox" id="free-willy" />
            </i>
          </EmbossButton>
        </section>
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

  img,
  #free-willy {
    width: 32px;
    height: 32px;
  }
`;

const Component = styled(ComponentBase)`
  width: 458px;

  ${dialogStyle};
`;
