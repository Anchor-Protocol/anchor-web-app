import { HorizontalDashedRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalDashedRuler';
import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';
import styled from 'styled-components';

export interface TxFeeListItemProps {
  label: ReactNode;
  children: ReactNode;
}

export interface TxFeeListProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    'children'
  > {
  children:
    | ReactElement<TxFeeListItemProps>
    | ReactElement<TxFeeListItemProps>[];
}

function TxFeeListBase({ className, ...ulProps }: TxFeeListProps) {
  return (
    <figure className={className}>
      <HorizontalDashedRuler />
      <ul {...ulProps} />
      <HorizontalDashedRuler />
    </figure>
  );
}

export function TxFeeListItem({ label, children }: TxFeeListItemProps) {
  return (
    <li>
      <span>{label}</span>
      <span>{children}</span>
    </li>
  );
}

export const TxFeeList = styled(TxFeeListBase)`
  font-size: 12px;

  ul {
    list-style: none;
    padding: 0;

    li {
      margin: 15px 0;

      display: flex;
      justify-content: space-between;
      align-items: center;

      > :first-child {
        color: ${({ theme }) => theme.dimTextColor};
      }

      > :last-child {
        color: ${({ theme }) => theme.textColor};
      }

      svg {
        font-size: 1em;
        transform: scale(1.2) translateY(0.08em);
      }
    }
  }
`;
