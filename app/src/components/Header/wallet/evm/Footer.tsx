import React from 'react';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { TermsMessage } from '../../desktop/TermsMessage';
import { useEvmWallet } from '@libs/evm-wallet';

interface FooterProps {
  includesReadonly: boolean;
  onClose: () => void;
}

export const Footer = ({ includesReadonly, onClose }: FooterProps) => {
  const { requestReadOnlyConnection } = useEvmWallet();

  return (
    <>
      {includesReadonly && (
        <Tooltip
          title="Read-only mode for viewing information. Please connect through a wallet to make transactions."
          placement="bottom"
        >
          <BorderButton
            className="readonly"
            onClick={() => {
              requestReadOnlyConnection();
              onClose();
            }}
          >
            View an address
          </BorderButton>
        </Tooltip>
      )}
      <TermsMessage />
    </>
  );
};
