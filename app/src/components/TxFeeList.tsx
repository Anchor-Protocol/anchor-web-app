import { HorizontalDashedRuler } from '@libs/neumorphism-ui/components/HorizontalDashedRuler';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { SwapHoriz } from '@material-ui/icons';
import big, { BigSource } from 'big.js';
import classNames from 'classnames';
import React, {
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
  gutters?: 'none' | 'compact' | 'large';
}

function TxFeeListBase({
  className,
  showRuler = true,
  gutters = 'large',
  ...ulProps
}: TxFeeListProps) {
  return (
    <figure
      className={classNames(className, {
        'gutters-compact': gutters === 'compact',
        'gutters-large': gutters === 'large',
      })}
    >
      {showRuler && <HorizontalDashedRuler className="ruler" />}
      <ul {...ulProps} />
      {showRuler && <HorizontalDashedRuler className="ruler" />}
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

  &.gutters-large {
    ul {
      li {
        margin-top: 15px;
        margin-bottom: 15px;
      }
    }
  }

  &.gutters-compact {
    ul {
      li {
        margin-top: 8px;
        margin-bottom: 8px;
      }
    }
  }

  &.gutters-large,
  &.gutters-compact {
    ul {
      li {
        &:first-child {
          margin-top: 0;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .ruler {
    &:first-child {
      margin-bottom: 15px;
    }
    &:last-child {
      margin-top: 15px;
    }
  }

  ul {
    list-style: none;
    padding: 0;

    &:empty {
      display: none;
    }

    li {
      margin: 0;

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
