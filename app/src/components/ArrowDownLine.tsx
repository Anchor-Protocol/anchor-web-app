import { ArrowDown } from '@anchor-protocol/icons';
import c from 'color';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface ArrowDownLineProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'children'
  > {
  className?: string;
}

function ArrowDownLineBase(props: ArrowDownLineProps) {
  return (
    <div {...props}>
      <ArrowDown />
    </div>
  );
}

export const ArrowDownLine = styled(ArrowDownLineBase)`
  color: ${({ theme }) => c(theme.textColor).alpha(0.2).toString()};
  text-align: center;
`;
