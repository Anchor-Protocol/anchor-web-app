import {
  ButtonHTMLAttributes,
  ComponentType,
  createElement,
  DetailedHTMLProps,
} from 'react';
import styled from 'styled-components';

export interface IconToggleButtonProps
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'onChange' | 'children'
  > {
  on: boolean;
  onChange: (next: boolean) => void;
  onIcon: ComponentType;
  offIcon: ComponentType;
}

function IconToggleButtonBase({
  on,
  onChange,
  onClick,
  onIcon,
  offIcon,
  ...buttonProps
}: IconToggleButtonProps) {
  return (
    <button
      {...buttonProps}
      onClick={(event) => {
        onClick && onClick(event);
        onChange(!on);
      }}
    >
      {on ? createElement(onIcon) : createElement(offIcon)}
    </button>
  );
}

export const IconToggleButton = styled(IconToggleButtonBase)`
  border: none;
  outline: none;
  background-color: transparent;

  cursor: pointer;

  svg {
    font-size: 1em;
  }
`;
