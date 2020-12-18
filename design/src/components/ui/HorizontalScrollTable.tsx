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
}

function HorizontalScrollTableBase({
  className,
  ...tableProps
}: HorizontalScrollTableProps) {
  const container = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLTableElement>(null);
  const separator = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || !table.current) {
      return;
    }

    const thead = table.current.querySelector('thead');

    if (!thead) return;

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      if (separator.current) {
        separator.current.style.top = `${entries[0].contentRect.height}px`;
      }
    });

    observer.observe(thead);

    if (separator.current) {
      separator.current.style.top = `${thead.getBoundingClientRect().height}px`;
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={container} className={className}>
      <div className="scroll-container">
        <table ref={table} cellSpacing="0" cellPadding="0" {...tableProps} />
      </div>
      <div ref={separator} className="separator" />
    </div>
  );
}

export const HorizontalScrollTable = styled(HorizontalScrollTableBase)`
  position: relative;

  > .scroll-container {
    overflow-x: scroll;

    > table {
      width: 100%;
      table-layout: fixed;

      tbody:before {
        content: '-';
        display: block;
        line-height: 5px;
        color: transparent;
      }

      tbody {
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

  > .separator {
    user-select: none;
    pointer-events: none;
    
    border-radius: 2px;

    top: -10px; // hidden
    left: 0;
    right: 0;
    height: 5px;
    position: absolute;

    ${({ theme }) =>
      pressed({
        color: theme.backgroundColor,
        distance: 2,
        intensity: theme.intensity,
      })};
  }

  th {
    padding: 25px 15px;
  }
  
  td {
    padding: 15px;
  }
`;
