import {
  pressed,
  rulerLightColor,
  rulerShadowColor,
} from '@ssen/styled-neumorphism';
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
  className?: string;
  headRulerWeight?: number;
  footRulerWeight?: number;
}

const defaultRulerWeight: number = 5;

function HorizontalScrollTableBase({
  className,
  headRulerWeight = defaultRulerWeight,
  footRulerWeight = defaultRulerWeight,
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
            headRulerWeight
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
          thead.offsetTop + thead.offsetHeight - headRulerWeight
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
  }, [footRulerWeight, headRulerWeight]);

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

  > .scroll-container {
    overflow-x: scroll;

    > table {
      table-layout: auto;
      width: 100%;
      
      // ruler space over tbody
      thead:after,
      tfoot:before {
        content: '-';
        display: block;
        line-height: ${({ headRulerWeight = defaultRulerWeight }) =>
          headRulerWeight}px;
        color: transparent;
      }

      thead {
        font-size: 12px;
        font-weight: 500;
        color: ${({ theme }) => theme.table.head.textColor};

        th {
          text-align: left;
        }

        th,
        td {
          padding: 0 ${contentPadding}px 20px ${contentPadding}px;

          &:first-child {
            padding-left: 0;
          }

          &:last-child {
            padding-right: 0;
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
            padding-left: 0;
          }

          &:last-child {
            padding-right: 0;
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
    border-radius: ${({ headRulerWeight = defaultRulerWeight }) => headRulerWeight / 2}px;
    height: ${({ headRulerWeight = defaultRulerWeight }) => headRulerWeight}px;
  }

  > .footRuler {
    border-radius: ${({ footRulerWeight = defaultRulerWeight }) => footRulerWeight / 2}px;
    height: ${({ footRulerWeight = defaultRulerWeight }) => footRulerWeight}px;
  }
`;
