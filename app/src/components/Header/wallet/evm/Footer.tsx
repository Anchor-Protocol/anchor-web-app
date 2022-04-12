import React from 'react';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { TermsMessage } from '../../desktop/TermsMessage';

interface FooterProps {
  includesReadonly: boolean;
  onClose: () => void;
}

export const Footer = ({ includesReadonly, onClose }: FooterProps) => {
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
              // Start "view an address" flow
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
