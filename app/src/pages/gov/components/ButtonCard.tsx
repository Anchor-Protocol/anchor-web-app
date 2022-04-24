import { UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';
import { ChevronRight } from '@material-ui/icons';
import { Card } from './Card';

interface ButtonCardProps extends UIElementProps {}

function ButtonCardBase(props: ButtonCardProps) {
  const { className, children } = props;
  return (
    <Card className={className}>
      <div className="children">{children}</div>
      <ChevronRight className="chevron" />
    </Card>
  );
}

export const ButtonCard = styled(ButtonCardBase)`
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
  }

  .NeuSectionContent {
    display: flex;
    align-items: center;
  }

  .children {
    flex-grow: 1;
  }

  .chevron {
    margin-right: -20px;
  }
`;
