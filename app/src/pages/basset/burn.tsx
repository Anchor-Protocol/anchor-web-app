import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import React from 'react';
import styled from 'styled-components';
import { Burn as BurnTabContent } from './components/Burn';

export interface BurnProps {
  className?: string;
}

function BurnBase({ className }: BurnProps) {
  // ---------------------------------------------
  // states
  // ---------------------------------------------
  return (
    <Section className={className}>
      <BurnTabContent />
    </Section>
  );
}

export const Burn = styled(BurnBase)`
  .burn-description,
  .gett-description {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 16px;
    color: ${({ theme }) => theme.dimTextColor};

    > :last-child {
      font-size: 12px;
    }

    margin-bottom: 12px;
  }

  .burn,
  .gett {
    margin-bottom: 30px;
  }

  hr {
    margin: 40px 0;
  }

  .validator {
    width: 100%;
    margin-bottom: 40px;

    &[data-selected-value=''] {
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  .receipt {
    margin-bottom: 40px;
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;
