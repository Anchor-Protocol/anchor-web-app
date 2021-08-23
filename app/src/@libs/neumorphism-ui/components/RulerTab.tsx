import React, { CSSProperties, ReactElement, ReactNode, useMemo } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { HorizontalHeavyRuler } from './HorizontalHeavyRuler';
import { TabBaseProps } from './Tab';
import { Tooltip } from './Tooltip';

export interface RulerTabProps<T> extends TabBaseProps<T> {
  className?: string;

  rulerWidth?: number;
  itemWidth?: number;

  /** height value to change look */
  height?: number;

  style?: CSSProperties;
}

const defaultRulerWidth: number = 5;
const defaultItemWidth: number = 112;
const defaultHeight: number = 50;

function RulerTabBase<T>({
  className,
  rulerWidth = defaultRulerWidth,
  itemWidth: _itemWidth = defaultItemWidth,
  items,
  selectedItem,
  onChange,
  height = defaultHeight,
  keyFunction,
  labelFunction,
  tooltipFunction,
  style,
  disabled,
}: RulerTabProps<T>) {
  const { ref, width: containerWidth = 700 } = useResizeObserver();

  const itemWidth = useMemo(() => {
    return containerWidth > 500
      ? _itemWidth
      : Math.floor(containerWidth / items.length);
  }, [_itemWidth, containerWidth, items.length]);

  return (
    <div
      className={className}
      ref={ref}
      style={style}
      aria-disabled={disabled || undefined}
    >
      <HorizontalHeavyRuler
        className="background-ruler"
        rulerWidth={rulerWidth}
      />

      <hr
        className="point-ruler"
        style={{
          transform: `translateX(${
            itemWidth * items.indexOf(selectedItem) + 1
          }px)`,
          left: 0,
          width: itemWidth - 2,
        }}
      />

      <ul>
        {items.map((item, i) => {
          const button = (
            <li
              key={'tab-button' + keyFunction(item)}
              role="tab"
              style={{
                minWidth: itemWidth,
                maxWidth: itemWidth,
                height,
              }}
              aria-selected={
                selectedItem === item
                  ? keyFunction(item) === keyFunction(selectedItem)
                  : undefined
              }
              onClick={selectedItem === item ? undefined : () => onChange(item)}
            >
              {labelFunction(item)}
            </li>
          );

          const tooltipContent: ReactNode =
            tooltipFunction && tooltipFunction(item);

          return tooltipContent ? (
            <Tooltip
              key={'tab-button-tooltip' + keyFunction(item)}
              title={tooltipContent}
              placement="top"
            >
              {button}
            </Tooltip>
          ) : (
            button
          );
        })}
      </ul>
    </div>
  );
}

export const RulerTab: <T>(
  props: RulerTabProps<T>,
) => ReactElement<RulerTabProps<T>> = styled(RulerTabBase)`
  position: relative;

  height: ${({ height = defaultHeight }) => height}px;

  ul {
    list-style: none;
    padding: 0;

    display: flex;

    li {
      user-select: none;
      cursor: pointer;

      font-size: 18px;
      font-weight: 500;
      display: grid;
      place-content: center;

      color: ${({ theme }) => theme.dimTextColor};

      &[aria-selected='true'] {
        color: ${({ theme }) => theme.textColor};
      }
    }
  }

  hr.point-ruler {
    pointer-events: none;
    user-select: none;

    transition: transform 0.2s ease-out;

    padding: 0;
    margin: 0;
    border: 0;

    position: absolute;
    bottom: 1px;
    height: ${({ rulerWidth = defaultRulerWidth }) => rulerWidth - 2}px;

    background-color: ${({ theme }) => theme.textColor};
    border-radius: 18px;
  }

  hr.background-ruler {
    pointer-events: none;
    user-select: none;

    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.3;
  }

  @media (max-width: 500px) {
    ul {
      li {
        font-size: 14px;
      }
    }
  }
`;
