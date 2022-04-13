import { Section } from '@libs/neumorphism-ui/components/Section';
import { UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';

function OverviewCardBase(props: UIElementProps) {
  const { className, children } = props;
  return <Section className={className}>{children}</Section>;
}

export const OverviewCard = styled(OverviewCardBase)`
  display: grid;
  align-items: center;

  .NeuSection-content {
    padding: 40px;
  }

  h2 {
    font-size: 12px;
    font-weight: 500;

    margin-bottom: 10px;
  }

  div {
    font-size: 32px;
    font-weight: 500;

    sub {
      font-size: 18px;
      vertical-align: middle;

      span {
        color: ${({ theme }) => theme.dimTextColor};
      }
    }
  }
`;
