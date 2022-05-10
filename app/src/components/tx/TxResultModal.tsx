import React from 'react';
import styled from 'styled-components';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { Modal } from '@material-ui/core';

interface TxResultModalProps {
  children: React.ReactNode;
}

export const TxResultModal = ({ children }: TxResultModalProps) => (
  <Modal open disableBackdropClick disableEnforceFocus>
    <Container>{children}</Container>
  </Modal>
);

const Container = styled(Dialog)`
  width: 720px;
`;
