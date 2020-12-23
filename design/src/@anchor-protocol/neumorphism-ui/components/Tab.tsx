import { flat, pressed } from '@anchor-protocol/styled-neumorphism';
import c from 'color';
import { ReactElement, useMemo } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

export interface TabProps<T> {
  className?: string;
  
  /** Data */
  items: T[];
  
  /** Selected item of the items */
  selectedItem: T;
  
  /** Callback when an item selection */
  onChange: (nextItem: T) => void;
  
  /** Get the label string from the item */
  labelFunction: (item: T) => string;
  
  /** Get the primary key value from the item */
  keyFunction: (item: T) => string;
  
  /** height value to change look */
  height?: number;
}

const defaultHeight: number = 60;
const buttonPadding: number = 8; // top + bottom

function TabBase<T>({
  className,
  items,
  selectedItem,
  onChange,
  keyFunction,
  labelFunction,
  height = defaultHeight,
}: TabProps<T>) {
  const { ref: divRef, width = 500 } = useResizeObserver<HTMLDivElement>({});

  const itemWidth = useMemo(() => {
    return Math.floor(width / items.length);
  }, [items.length, width]);

  const currentItemIndex = useMemo(() => {
    return items.findIndex((item) => item === selectedItem) ?? 0;
  }, [items, selectedItem]);

  return (
    <div className={className} ref={divRef}>
      <ul>
        {items.map((item, i) => (
          <li
            key={'tab-button' + keyFunction(item)}
            role="tab"
            style={{ width: itemWidth, height, left: itemWidth * i, top: 0 }}
            aria-selected={
              selectedItem
                ? keyFunction(item) === keyFunction(selectedItem)
                : undefined
            }
            onClick={() => onChange(item)}
          >
            {labelFunction(item)}
          </li>
        ))}
      </ul>

      <div
        style={{
          width: itemWidth,
          height,
          left: 0,
          top: 0,
          transform: `translateX(${itemWidth * currentItemIndex}px)`,
        }}
      >
        <ul>
          {items.map((item, i) => (
            <li
              key={'display' + keyFunction(item)}
              style={{
                transform: `translateY(${
                  (height - buttonPadding * 2) * currentItemIndex * -1
                }px)`,
                opacity: currentItemIndex === i ? 1 : 0.5,
              }}
            >
              {labelFunction(item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const Tab: <T>(props: TabProps<T>) => ReactElement<TabProps<T>> = styled(
  TabBase,
)`
  border-radius: 22px;
  height: ${({ height = defaultHeight }) => height}px;

  ${({ theme }) =>
    pressed({
      color: theme.textInput.backgroundColor,
      backgroundColor: theme.backgroundColor,
      intensity: theme.intensity,
      distance: 1,
    })};

  position: relative;

  > ul {
    height: 100%;
    list-style: none;
    padding: 0;

    li {
      position: absolute;

      display: grid;
      place-items: center;

      user-select: none;
      cursor: pointer;

      font-size: 20px;
      color: ${({ theme }) => c(theme.textColor).alpha(0.3).string()};

      &:hover {
        color: ${({ theme }) => c(theme.textColor).alpha(0.7).string()};
        background-color: ${({ theme }) =>
          c(theme.actionButton.backgroundColor).alpha(0.2).string()};
      }

      &[aria-selected='true'] {
        cursor: none;
        pointer-events: none;
      }

      border-radius: 22px;
    }
  }

  > div {
    position: absolute;

    user-select: none;
    pointer-events: none;

    will-change: transform;

    transition: transform 0.3s ease-in-out;

    padding: ${buttonPadding}px;

    > ul {
      list-style: none;
      padding: 0;

      width: 100%;
      height: 100%;

      border-radius: 18px;

      overflow: hidden;

      ${({ theme }) =>
        flat({
          color: theme.backgroundColor,
          backgroundColor: theme.textInput.backgroundColor,
          distance: 3,
          intensity: theme.intensity,
        })};

      li {
        width: 100%;
        height: 100%;

        font-size: 20px;
        font-weight: 700;

        display: grid;
        place-items: center;

        will-change: transform;
        transition: transform 0.5s ease-in-out;
      }
    }
  }
`;
