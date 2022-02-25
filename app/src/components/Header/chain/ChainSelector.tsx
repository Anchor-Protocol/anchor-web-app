import React, { useState } from 'react';
import { UIElementProps } from '@libs/ui';
import { ClickAwayListener } from '@material-ui/core';
import styled from 'styled-components';
import { ChainButton } from './ChainButton';
import { DropdownBox, DropdownContainer } from '../desktop/DropdownContainer';
import { ChainList } from './ChainList';

const ChainSelectorBase = (props: UIElementProps) => {
  const { className } = props;

  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={className}>
        <ChainButton onClick={() => setOpen((v) => !v)} />
        {open && (
          <DropdownContainer>
            <DropdownBox>
              <ChainList onClose={() => setOpen((v) => !v)} />
            </DropdownBox>
          </DropdownContainer>
        )}
      </div>
    </ClickAwayListener>
  );
};

export const ChainSelector = styled(ChainSelectorBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;
