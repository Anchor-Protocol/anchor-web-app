import React, { DOMAttributes } from 'react';
import { UIElementProps } from '@libs/ui';
import { Launch } from '@material-ui/icons';
import { ToolbarButtonStyle } from 'components/ToolbarButtonStyle';
import styled from 'styled-components';

interface WithdrawButtonProps
  extends UIElementProps,
    Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> {}

const Component = (props: WithdrawButtonProps) => {
  const { className, onClick } = props;
  return (
    <button className={className} onClick={onClick}>
      CLAIM
      <Launch />
    </button>
  );
};

export const WithdrawButton = styled(Component)`
  ${ToolbarButtonStyle};

  padding: 2px 6px 2px 6px;
`;
