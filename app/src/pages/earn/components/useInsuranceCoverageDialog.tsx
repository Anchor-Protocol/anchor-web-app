import { Modal } from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { EmbossButton } from '@terra-dev/neumorphism-ui/components/EmbossButton';
import { DialogProps, OpenDialog, useDialog } from '@terra-dev/use-dialog';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import insurAce from './assets/insurAce.svg';
import nexusMutual from './assets/nexusMutual.svg';

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
        <h1>Get Insurance Coverage</h1>

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
          href="https://www.insurace.io/"
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
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 458px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
    letter-spacing: -0.5px;
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
    }

    &:last-of-type {
      margin-top: 16px;
    }
  }
`;
