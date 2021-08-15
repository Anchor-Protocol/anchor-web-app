import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { HorizontalRuler } from './HorizontalRuler';

export function MultiColumnTableCell({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div>
        <span>{label}</span>
        <span>{children}</span>
      </div>
      <HorizontalRuler />
    </div>
  );
}

function getColumns(width: number, minWidth: number, gap: number): number {
  if (width < minWidth) {
    return 0;
  }

  let i: number = 0;
  const max: number = 4;
  while (++i < max) {
    if (width < minWidth * (i + 1) + gap * i) {
      return i;
    }
  }

  return max;
}

export interface MultiColumnTableProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  columnGap?: number;
  columnMinWidth?: number;
}

const defaultColumnGap = 110;
const defaultColumnMinWidth = 345;

function MultiColumnTableBase({
  columnGap = defaultColumnGap,
  columnMinWidth = defaultColumnMinWidth,
  ...divProps
}: MultiColumnTableProps) {
  const { ref, width = 800 } = useResizeObserver<HTMLElement>({});

  const columns: number = getColumns(width, columnMinWidth, columnGap);

  return <div ref={ref} {...divProps} data-columns={columns} />;
}

export const MultiColumnTable = styled(MultiColumnTableBase)`
  > div {
    > div {
      height: 69px;

      display: flex;
      justify-content: space-between;
      align-items: center;

      > :first-child {
        font-size: 13px;
        color: ${({ theme }) => theme.dimTextColor};
      }

      > :last-child {
        font-size: 18px;
        color: ${({ theme }) => theme.textColor};

        sub {
          font-size: 11px;
          vertical-align: bottom;
        }
      }
    }
  }

  hr {
    margin: 0;
  }

  &[data-columns='0'] {
    > div {
      > div {
        flex-direction: column;
        justify-content: space-evenly;
        align-items: start;
      }
    }
  }

  &[data-columns='2'] {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: ${({ columnGap = defaultColumnGap }) => columnGap}px;
  }

  &[data-columns='3'] {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: ${({ columnGap = defaultColumnGap }) => columnGap}px;
  }

  &[data-columns='4'] {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: ${({ columnGap = defaultColumnGap }) => columnGap}px;
  }
`;
