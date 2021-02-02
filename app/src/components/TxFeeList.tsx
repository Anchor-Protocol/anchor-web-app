import { HorizontalDashedRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalDashedRuler';
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

export interface TxFeeListItemProps {
  label: ReactNode;
  children: ReactNode;
}

export interface TxFeeListProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {
  showRuler?: boolean;
}

function TxFeeListBase({
  className,
  showRuler = true,
  ...ulProps
}: TxFeeListProps) {
  return (
    <figure className={className}>
      {showRuler && <HorizontalDashedRuler />}
      <ul {...ulProps} />
      {showRuler && <HorizontalDashedRuler />}
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
    }
  }
`;
