import { flat } from '@libs/styled-neumorphism';
import styled from 'styled-components';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';

/**
 * A styled component of the `<NativeSelect />` of the Material-UI
 *
 * @see https://material-ui.com/api/native-select/
 */
export const NativeSelect = styled(MuiNativeSelect)`
  border-radius: 5px;

  font-size: 14px;

  height: 60px;

  padding-left: 20px;

  .MuiNativeSelect-icon {
    right: 20px;
  }

  ${({ theme }) =>
    flat({
      color: theme.selector.backgroundColor,
      backgroundColor: theme.backgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};

  color: ${({ theme }) => theme.textInput.textColor};

  .MuiNativeSelect-icon {
    color: currentColor;
  }

  &:before,
  &:after {
    display: none;
  }

  &.Mui-focused {
    .MuiNativeSelect-root {
      background-color: transparent;
    }
  }

  &.Mui-disabled {
    opacity: 0.3;
  }
`;
