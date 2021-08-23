import { HorizontalRuler } from './HorizontalRuler';
import { flat } from '@libs/styled-neumorphism';
import { useSelect } from 'downshift';
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import c from 'color';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';

export interface SelectorProps<T> {
  className?: string;

  /** Data */
  items: T[];

  /** Selected item of the items */
  selectedItem: T | null;

  /** Callback when an item selection */
  onChange: (nextItem: T | null) => void;

  /** Get the label string from the item */
  labelFunction: (item: T | null) => string;

  /** Get the primary key value from the item */
  keyFunction: (item: T) => string;
}

function SelectorBase<T>({
  className,
  items,
  selectedItem,
  onChange,
  labelFunction,
  keyFunction,
}: SelectorProps<T>) {
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    selectedItem,
    onSelectedItemChange: ({ selectedItem }) => onChange(selectedItem ?? null),
  });
  return (
    <div className={className} aria-expanded={isOpen}>
      <button type="button" {...getToggleButtonProps()}>
        <span aria-selected={!!selectedItem}>
          {labelFunction(selectedItem)}
        </span>
        <i>{isOpen ? <ArrowDropUp /> : <ArrowDropDown />}</i>
      </button>
      {isOpen && <HorizontalRuler />}
      <ul {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <li
              data-selected={highlightedIndex === index}
              key={`${keyFunction(item)}${index}`}
              {...getItemProps({ item, index })}
            >
              {labelFunction(item)}
            </li>
          ))}
      </ul>
    </div>
  );
}

export const Selector: <T>(
  props: SelectorProps<T>,
) => ReactElement<SelectorProps<T>> = styled(SelectorBase)`
  border-radius: 5px;

  ${({ theme }) =>
    flat({
      color: theme.selector.backgroundColor,
      backgroundColor: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};

  button {
    width: 100%;
    height: 60px;
    border: 0;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    user-select: none;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.selector.textColor};
    text-align: left;
    padding: 0 20px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    span[aria-selected='false'] {
      opacity: 0.4;
    }
  }

  hr {
    margin: 0 0 5px 0 !important;
  }

  ul {
    outline: none;
    list-style: none;
    padding: 0;

    color: ${({ theme }) => c(theme.selector.textColor).alpha(0.7).string()};

    max-height: 300px;
    overflow-y: auto;

    li {
      padding: 10px 20px;
      user-select: none;

      &[data-selected='true'] {
        background-color: ${({ theme }) =>
          c(theme.selector.textColor).alpha(0.05).string()};
        color: ${({ theme }) => theme.selector.textColor};
      }
    }
  }
`;
