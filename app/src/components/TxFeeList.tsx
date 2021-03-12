import { HorizontalDashedRuler } from '@terra-dev/neumorphism-ui/components/HorizontalDashedRuler';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { SwapHoriz } from '@material-ui/icons';
import big, { BigSource } from 'big.js';
import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  useMemo,
  useState,
} from 'react';
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

export interface SwapListItemProps {
  label: string;
  currencyA: string;
  currencyB: string;
  exchangeRateAB: BigSource;
  formatExchangeRate: (n: BigSource, direction: 'a/b' | 'b/a') => string;
  initialDirection?: 'a/b' | 'b/a';
}

export function SwapListItem({
  label,
  currencyA,
  currencyB,
  exchangeRateAB,
  formatExchangeRate,
  initialDirection = 'b/a',
}: SwapListItemProps) {
  const [direction, setDirection] = useState<'a/b' | 'b/a'>(initialDirection);

  const exchangeRate = useMemo(() => {
    return direction === 'a/b'
      ? formatExchangeRate(exchangeRateAB, direction)
      : formatExchangeRate(big(1).div(exchangeRateAB), direction);
  }, [direction, exchangeRateAB, formatExchangeRate]);

  return (
    <li>
      <span>{label}</span>
      <IconSpan>
        {exchangeRate} {direction === 'a/b' ? currencyA : currencyB} per{' '}
        {direction === 'a/b' ? currencyB : currencyA}
        <SwapHoriz
          className="swap"
          onClick={() =>
            setDirection((prev) => (prev === 'a/b' ? 'b/a' : 'a/b'))
          }
        />
      </IconSpan>
    </li>
  );
}

export const TxFeeList = styled(TxFeeListBase)`
  font-size: 12px;

  ul {
    list-style: none;
    padding: 0;

    &:empty {
      display: none;
    }

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

      a {
        color: ${({ theme }) => theme.textColor};
      }

      svg.swap {
        transform: scale(1.3) translateY(0.1em);
        margin-left: 0.5em;
        cursor: pointer;
      }
    }
  }
`;
