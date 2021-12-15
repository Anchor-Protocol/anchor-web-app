import { DelayedNumberInput } from '@libs/ui';
import big from 'big.js';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode, useMemo } from 'react';
import styled from 'styled-components';

export interface SlippageSelectorProps {
  className?: string;
  items: number[];
  value: number;
  onChange: (nextValue: number) => void;
  helpText?: ReactNode;
}

function Component({
  className,
  items,
  value,
  onChange,
  helpText,
}: SlippageSelectorProps) {
  const selectedItem = useMemo(() => {
    return items.find((item) => item === value);
  }, [items, value]);

  return (
    <div className={className}>
      <div className="list">
        {items.map((item) => (
          <button
            role="checkbox"
            key={'item' + item}
            aria-checked={selectedItem === item}
            onClick={selectedItem !== item ? () => onChange(item) : undefined}
          >
            {item * 100}
            <span>%</span>
          </button>
        ))}

        <div
          className="manual-input"
          role="checkbox"
          aria-checked={typeof selectedItem !== 'number'}
        >
          <DelayedNumberInput<string>
            type="decimal"
            maxIntegerPoints={2}
            maxDecimalPoints={2}
            value={big(value).mul(100).toFixed()}
            onChange={(nextValue) =>
              nextValue.length > 0 &&
              onChange(big(nextValue).div(100).toNumber())
            }
          />
          <span>%</span>
        </div>
      </div>
      {helpText && <footer>{helpText}</footer>}
    </div>
  );
}

const StyledComponent = styled(Component)`
  position: relative;

  .list {
    display: flex;
    gap: 8px;

    button {
      cursor: pointer;

      width: 60px;
      height: 28px;
      border-radius: 20px;

      font-size: 12px;
      font-weight: 500;

      color: ${({ theme }) => theme.textColor};
      background-color: ${({ theme }) => theme.sectionBackgroundColor};
      border: 1px solid ${({ theme }) => theme.dimTextColor};

      &:hover {
        border: 1px solid ${({ theme }) => theme.colors.positive};
      }

      &[aria-checked='true'] {
        color: ${({ theme }) => theme.highlightBackgroundColor};
        background-color: ${({ theme }) => theme.colors.positive};
        border: 1px solid ${({ theme }) => theme.colors.positive};
      }
    }

    .manual-input {
      width: 60px;
      height: 28px;
      border-radius: 20px;
      padding: 0 10px;

      display: flex;
      align-items: center;

      font-size: 12px;
      font-weight: 500;

      border: 1px solid ${({ theme }) => theme.dimTextColor};

      input {
        flex: 1;
        min-width: 0;
        text-align: right;

        font-size: 12px;
        font-weight: 500;

        color: ${({ theme }) => theme.dimTextColor};
      }

      transition: width 0.1s ease-out;

      &:focus-within {
        width: 80px;

        border: 1px solid ${({ theme }) => theme.colors.positive};

        input {
          color: ${({ theme }) => theme.textColor};
        }
      }

      &[aria-checked='true'] {
        width: 80px;

        color: ${({ theme }) => theme.highlightBackgroundColor};
        background-color: ${({ theme }) => theme.colors.positive};
        border: 1px solid ${({ theme }) => theme.colors.positive};

        input {
          color: ${({ theme }) => theme.highlightBackgroundColor};
        }
      }
    }
  }

  footer {
    position: absolute;
    left: 0;
    bottom: -23px;
  }
`;

export const SlippageSelector = fixHMR(StyledComponent);

export const SlippageSelectorPositiveHelpText = styled.span`
  font-size: 12px;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.positive};
`;

export const SlippageSelectorNegativeHelpText = styled.span`
  font-size: 12px;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.negative};
`;
