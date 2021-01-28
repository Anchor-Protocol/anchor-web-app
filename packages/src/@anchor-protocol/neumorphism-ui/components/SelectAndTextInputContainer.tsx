import {
  rulerLightColor,
  rulerShadowColor,
  softPressed,
} from '@anchor-protocol/styled-neumorphism';
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

export interface SelectAndTextInputContainerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  leftHelperText?: ReactNode;
  rightHelperText?: ReactNode;
  error?: boolean;
}

function SelectAndTextInputContainerBase({
  leftHelperText,
  rightHelperText,
  error,
  children,
  ...divProps
}: SelectAndTextInputContainerProps) {
  return (
    <div {...divProps} aria-invalid={!!error}>
      {children}
      {leftHelperText && <LeftHelperText>{leftHelperText}</LeftHelperText>}
      {rightHelperText && <RightHelperText>{rightHelperText}</RightHelperText>}
    </div>
  );
}

/**
 * A container for combine the form components (e.g. `<NativeSelect/>`, `<Input/>`...)
 *
 * @example
 *
 * ```jsx
 * <SelectAndTextInputContainer>
 *   <NativeSelect
 *     value={}
 *     onChange={}
 *   >
 *     {items.map(({ label, value }) => (
 *       <option key={value} value={value}>
 *         {label}
 *       </option>
 *     ))}
 *   </NativeSelect>
 *   <Input placeholder="PLACEHOLDER" />
 * </SelectAndTextInputContainer>
 * ```
 */
export const SelectAndTextInputContainer = styled(
  SelectAndTextInputContainerBase,
)`
  border-radius: 5px;

  ${({ theme }) =>
    softPressed({
      color: theme.textInput.backgroundColor,
      backgroundColor: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity * 2,
    })};

  height: 60px;
  padding: 2px 20px;

  display: flex;

  position: relative;

  color: ${({ theme }) => theme.textInput.textColor};

  .MuiInputBase-input,
  .MuiInputBase-root {
    color: ${({ theme }) => theme.textInput.textColor};
  }

  .MuiNativeSelect-icon {
    color: currentColor;
  }

  > div:not(:last-of-type) {
    padding-right: 20px;
    border-right: 1px solid
      ${({ theme }) =>
        rulerShadowColor({
          color: theme.textInput.backgroundColor,
          intensity: theme.intensity,
        })};
  }

  > div:not(:first-of-type) {
    padding-left: 20px;
    border-left: 1px solid
      ${({ theme }) =>
        rulerLightColor({
          color: theme.textInput.backgroundColor,
          intensity: theme.intensity,
        })};
  }

  .MuiInput-underline:before,
  .MuiInput-underline:after {
    display: none;
  }

  .Mui-focused {
    .MuiNativeSelect-root {
      background-color: transparent;
    }
  }

  &[aria-disabled='true'] {
    user-select: none;
    pointer-events: none;
    opacity: 0.3;
  }

  &[aria-invalid='true'] {
    color: ${({ theme }) => theme.errorTextColor};

    .MuiInputBase-input,
    .MuiInputBase-root {
      color: ${({ theme }) => theme.errorTextColor};
    }
  }
`;

const LeftHelperText = styled.span`
  font-size: 12px;
  flex-shrink: 0;
  position: absolute;
  left: 0;
  bottom: -20px;

  color: inherit;
`;

const RightHelperText = styled.span`
  font-size: 12px;
  flex-shrink: 0;
  position: absolute;
  right: 0;
  bottom: -20px;

  color: inherit;
`;
