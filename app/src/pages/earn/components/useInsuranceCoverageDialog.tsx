import { Modal } from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { EmbossButton } from '@libs/neumorphism-ui/components/EmbossButton';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import bridgeMutual from './assets/bridgeMutual.svg';
import insurAce from './assets/insurAce.svg';
import nexusMutual from './assets/nexusMutual.svg';
import unslashed from './assets/unslashed.svg';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useInsuranceCoverageDialog(): [
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
        <h1>Protect Your Deposit</h1>

        <section>
          <h2>UST Peg</h2>

          <EmbossButton
            component="a"
            href="https://unslashed.finance/"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              Unslashed{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={unslashed} alt="Unslashed" />
            </i>
          </EmbossButton>
        </section>

        <section>
          <h2>Smart Contracts</h2>

          <EmbossButton
            component="a"
            href="https://nexusmutual.io/"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              Nexus Mutual{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={nexusMutual} alt="Nexus Mutual" />
            </i>
          </EmbossButton>

          <EmbossButton
            component="a"
            href="https://app.insurace.io/Insurance/Cart?id=56&referrer=1403699302269502414217348026580880651844264120067"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              InsurAce{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={insurAce} alt="InsurAce" />
            </i>
          </EmbossButton>

          <EmbossButton
            component="a"
            href="https://www.bridgemutual.io/"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              Bridge Mutual{' '}
              <sub>
                <Launch />
              </sub>
            </span>
            <i>
              <img src={bridgeMutual} alt="Bridge Mutual" />
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
`;

const Component = styled(ComponentBase)`
  width: 458px;

  ${dialogStyle};
`;
