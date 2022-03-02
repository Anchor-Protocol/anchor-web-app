import React, { useState } from 'react';
import { UIElementProps } from '@libs/ui';
import { ClickAwayListener } from '@material-ui/core';
import styled from 'styled-components';
import { RedemptionButton } from './RedemptionButton';
import { DropdownBox, DropdownContainer } from '../desktop/DropdownContainer';
import { RedemptionList } from './RedemptionList';
import { useRedemptionStorage } from 'tx/evm/storage/useRedemptionStorage';

const RedemptionWidgetBase = (props: UIElementProps) => {
  const { className } = props;

  const [open, setOpen] = useState(false);
  const { redemptions } = useRedemptionStorage();

  if (redemptions.length === 0) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={className}>
        <RedemptionButton onClick={() => setOpen((v) => !v)} />
        {open && (
          <DropdownContainer>
            <DropdownBox>
              <RedemptionList onClose={() => setOpen((v) => !v)} />
            </DropdownBox>
          </DropdownContainer>
        )}
      </div>
    </ClickAwayListener>
  );
};

export const RedemptionWidget = styled(RedemptionWidgetBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;
