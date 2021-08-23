import {
  pressed,
  rulerLightColor,
  rulerShadowColor,
} from '@libs/styled-neumorphism';
import React, {
  DetailedHTMLProps,
  TableHTMLAttributes,
  useEffect,
  useRef,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';

export interface HorizontalScrollTableProps
  extends DetailedHTMLProps<
    TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {
  /** Line width under the table header */
  headRulerWidth?: number;

  /** Line width over the table footer */
  footRulerWidth?: number;

  /** Table minimum width */
  minWidth: number;

  /** padding-left of first-child */
  startPadding?: number;

  /** padding-right of last-child */
  endPadding?: number;
}

const defaultRulerWidth: number = 5;
const defaultStartPadding: number = 0;
const defaultEndPadding: number = 0;

function HorizontalScrollTableBase({
  className,
  headRulerWidth = defaultRulerWidth,
  footRulerWidth = defaultRulerWidth,
  minWidth,
  startPadding,
  endPadding,
  ...tableProps
}: HorizontalScrollTableProps) {
  const container = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLTableElement>(null);
  const headRuler = useRef<HTMLDivElement>(null);
  const footRuler = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || !table.current) {
      return;
    }

    const thead = table.current.querySelector('thead');
    const tfoot = table.current.querySelector('tfoot');

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const { target } of entries) {
        if (target.tagName.toLowerCase() === 'thead' && headRuler.current) {
          headRuler.current.style.top = `${
            (target as HTMLElement).offsetTop +
            (target as HTMLElement).offsetHeight -
            headRulerWidth
          }px`;
        }

        if (target.tagName.toLowerCase() === 'tfoot' && footRuler.current) {
          footRuler.current.style.top = `${
            (target as HTMLElement).offsetTop
          }px`;
        }
      }
    });

    if (headRuler.current) {
      if (thead) {
        headRuler.current.style.visibility = 'visible';
        headRuler.current.style.top = `${
          thead.offsetTop + thead.offsetHeight - headRulerWidth
        }px`;

        observer.observe(thead);
      } else {
        headRuler.current.style.visibility = 'hidden';
      }
    }

    if (footRuler.current) {
      if (tfoot) {
        footRuler.current.style.visibility = 'visible';
        footRuler.current.style.top = `${tfoot.offsetTop}px`;

        observer.observe(tfoot);
      } else {
        footRuler.current.style.visibility = 'hidden';
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [footRulerWidth, headRulerWidth]);

  return (
    <div ref={container} className={className}>
      <div className="scroll-container">
        <table ref={table} cellSpacing="0" cellPadding="0" {...tableProps} />
      </div>
      <div ref={headRuler} className="headRuler" />
      <div ref={footRuler} className="footRuler" />
    </div>
  );
}

const contentPadding: number = 15;

export const HorizontalScrollTable = styled(HorizontalScrollTableBase)`
  position: relative;

  th {
    font-weight: 500;
    text-align: left;
    line-height: 1.5;
  }

  > .scroll-container {
    overflow-x: scroll;

    > table {
      table-layout: auto;
      width: 100%;
      min-width: ${({ minWidth }) => minWidth}px;

      // ruler space over tbody
      thead:after,
      tfoot:before {
        content: '-';
        display: block;
        line-height: ${({ headRulerWidth = defaultRulerWidth }) =>
          headRulerWidth}px;
        color: transparent;
      }

      th,
      td {
        white-space: nowrap;
      }

      thead {
        font-size: 13px;
        color: ${({ theme }) => theme.table.head.textColor};

        th,
        td {
          padding: 0 ${contentPadding}px 20px ${contentPadding}px;

          &:first-child {
            padding-left: ${({ startPadding = defaultStartPadding }) =>
              startPadding}px;
          }

          &:last-child {
            padding-right: ${({ endPadding = defaultEndPadding }) =>
              endPadding}px;
          }
        }
      }

      tbody,
      tfoot {
        font-size: 18px;
        color: ${({ theme }) => theme.table.body.textColor};

        th,
        td {
          padding: 30px ${contentPadding}px;

          &:first-child {
            padding-left: ${({ startPadding = defaultStartPadding }) =>
              startPadding}px;
          }

          &:last-child {
            padding-right: ${({ endPadding = defaultEndPadding }) =>
              endPadding}px;
          }
        }

        tr {
          th,
          td {
            border-top: 1px solid
              ${({ theme }) =>
                rulerLightColor({
                  intensity: theme.intensity,
                  color: theme.backgroundColor,
                })};
            border-bottom: 1px solid
              ${({ theme }) =>
                rulerShadowColor({
                  intensity: theme.intensity,
                  color: theme.backgroundColor,
                })};
          }

          &:last-child {
            th,
            td {
              border-bottom: 0;
            }
          }

          &:first-child {
            th,
            td {
              border-top: 0;
            }
          }
        }
      }
    }
  }

  > .headRuler,
  > .footRuler {
    user-select: none;
    pointer-events: none;

    visibility: hidden;

    top: -10px;
    left: 0;
    right: 0;
    position: absolute;

    ${({ theme }) =>
      pressed({
        color: theme.backgroundColor,
        distance: 1,
        intensity: theme.intensity,
      })};
  }

  > .headRuler {
    border-radius: ${({ headRulerWidth = defaultRulerWidth }) =>
      headRulerWidth / 2}px;
    height: ${({ headRulerWidth = defaultRulerWidth }) => headRulerWidth}px;
  }

  > .footRuler {
    border-radius: ${({ footRulerWidth = defaultRulerWidth }) =>
      footRulerWidth / 2}px;
    height: ${({ footRulerWidth = defaultRulerWidth }) => footRulerWidth}px;
  }
`;
