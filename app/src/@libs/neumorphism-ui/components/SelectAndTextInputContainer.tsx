import {
  rulerLightColor,
  rulerShadowColor,
  softPressed,
} from '@libs/styled-neumorphism';
import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

type GridTemplate = number | string; // of number | `${number}fr`

export interface SelectAndTextInputContainerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  leftHelperText?: ReactNode;
  rightHelperText?: ReactNode;
  error?: boolean;
  gridColumns: GridTemplate[];
  gridRows?: number[];
}

function parseGridTemplate(template: GridTemplate[]): string {
  return template
    .map((col) => (typeof col === 'number' ? `${col}px` : col))
    .join(' ');
}

function notFirstColumn(columnLength: number): string {
  return `:not(:nth-child(${columnLength}n - ${columnLength - 1}))`;
}

function notLastColumn(columnLength: number): string {
  return `:not(:nth-child(${columnLength}n + 0))`;
}

function notFirstRow(columnLength: number): string {
  return `:not(:nth-child(-n + ${columnLength}))`;
}

function notLastRow(columnLength: number, rowLength: number): string {
  return `:not(:nth-child(n + ${columnLength * rowLength - columnLength + 1}))`;
}

function SelectAndTextInputContainerBase({
  leftHelperText,
  rightHelperText,
  error,
  children,
  gridColumns,
  gridRows,
  ...divProps
}: SelectAndTextInputContainerProps) {
  return (
    <div {...divProps} aria-invalid={!!error}>
      <div role="grid">{children}</div>
      {leftHelperText && (
        <LeftHelperText aria-invalid={!!error}>{leftHelperText}</LeftHelperText>
      )}
      {rightHelperText && (
        <RightHelperText aria-invalid={!!error}>
          {rightHelperText}
        </RightHelperText>
      )}
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

  position: relative;

  ${({ theme, ...props }) =>
    softPressed({
      color:
        props['aria-readonly'] === true
          ? theme.backgroundColor
          : theme.textInput.backgroundColor,
      backgroundColor: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity * 2,
    })};

  //padding: 2px 20px;

  > :first-child {
    display: grid;

    grid-template-columns: ${({ gridColumns }) =>
      parseGridTemplate(gridColumns)};
    grid-template-rows: ${({ gridRows = [60] }) => parseGridTemplate(gridRows)};

    color: ${({ theme }) => theme.textInput.textColor};

    .MuiInputBase-input,
    .MuiInputBase-root {
      color: ${({ theme }) => theme.textInput.textColor};
    }

    .MuiNativeSelect-icon {
      color: currentColor;
      right: 10px;
    }

    > * {
      padding-right: 20px;
      padding-left: 20px;
    }

    > ${({ gridColumns }) => notFirstRow(gridColumns.length)} {
      border-top: 1px solid
        ${({ theme }) =>
          rulerLightColor({
            color: theme.textInput.backgroundColor,
            intensity: theme.intensity,
          })};
    }

    > ${({ gridColumns, gridRows = [60] }) =>
        notLastRow(gridColumns.length, gridRows.length)} {
      border-bottom: 1px solid
        ${({ theme }) =>
          rulerShadowColor({
            color: theme.textInput.backgroundColor,
            intensity: theme.intensity,
          })};
    }

    > ${({ gridColumns }) => notLastColumn(gridColumns.length)} {
      border-right: 1px solid
        ${({ theme }) =>
          rulerShadowColor({
            color: theme.textInput.backgroundColor,
            intensity: theme.intensity,
          })};
    }

    > ${({ gridColumns }) => notFirstColumn(gridColumns.length)} {
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
  }

  &[aria-disabled='true'] {
    user-select: none;
    pointer-events: none;
    opacity: 0.3;
  }

  &[aria-invalid='true'] {
    color: ${({ theme }) => theme.colors.negative};

    .MuiInputBase-input,
    .MuiInputBase-root {
      color: ${({ theme }) => theme.colors.negative};
    }
  }
`;

const LeftHelperText = styled.span`
  font-size: 12px;
  flex-shrink: 0;
  position: absolute;
  left: 0;
  bottom: -20px;

  color: ${({ theme }) => theme.dimTextColor};

  &[aria-invalid='true'] {
    color: ${({ theme }) => theme.colors.negative};
  }
`;

const RightHelperText = styled.span`
  font-size: 12px;
  flex-shrink: 0;
  position: absolute;
  right: 0;
  bottom: -20px;

  color: ${({ theme }) => theme.dimTextColor};

  &[aria-invalid='true'] {
    color: ${({ theme }) => theme.colors.negative};
  }
`;
