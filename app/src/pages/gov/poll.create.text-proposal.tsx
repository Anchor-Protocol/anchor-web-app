import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import { InputAdornment } from '@material-ui/core';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { FormLayout } from 'pages/gov/components/FormLayout';
import React from 'react';
import styled from 'styled-components';

export interface pollCreateTextProposalProps {
  className?: string;
}

function pollCreateTextProposalBase({
  className,
}: pollCreateTextProposalProps) {
  return (
    <FormLayout className={className}>
      <Section>
        <h1>Submit Text Proposal</h1>

        <div className="description">
          <p>Label</p>
          <p />
        </div>

        <TextInput placeholder="Label" />

        <div className="description">
          <p>Label</p>
          <p />
        </div>

        <TextInput placeholder="Label" multiline rows={4} />

        <div className="description">
          <p>Label</p>
          <p />
        </div>

        <TextInput
          placeholder="Label"
          InputProps={{
            endAdornment: <InputAdornment position="end">Unit</InputAdornment>,
          }}
        />

        <TxFeeList className="receipt">
          <TxFeeListItem
            label={
              <IconSpan>
                Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
              </IconSpan>
            }
          >
            0 UST
          </TxFeeListItem>
        </TxFeeList>

        <ActionButton className="proceed">Swap</ActionButton>
      </Section>
    </FormLayout>
  );
}

export const pollCreateTextProposal = styled(pollCreateTextProposalBase)``;
