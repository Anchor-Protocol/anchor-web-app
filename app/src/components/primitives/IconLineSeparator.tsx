import { ArrowDown } from '@anchor-protocol/icons';
import c from 'color';
import React, { ComponentType, DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface IconLineSeparatorProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'children'
  > {
  className?: string;
  Icon?: ComponentType;
}

function IconLineSeparatorBase({
  Icon = ArrowDown,
  ...props
}: IconLineSeparatorProps) {
  return (
    <div {...props}>
      <Icon />
    </div>
  );
}

export const IconLineSeparator = styled(IconLineSeparatorBase)`
  color: ${({ theme }) => c(theme.textColor).alpha(0.2).toString()};
  text-align: center;
`;
