import React, { useState } from 'react';
import { UIElementProps } from '@libs/ui';
import { ClickAwayListener } from '@material-ui/core';
import styled from 'styled-components';
import { RedemptionButton } from './RedemptionButton';
import { DropdownBox, DropdownContainer } from '../desktop/DropdownContainer';
import { RedemptionList } from './RedemptionList';
import { useRedemptions } from 'tx/evm/storage/useRedemptions';
import { Link } from 'react-router-dom';

const RedemptionWidgetBase = (props: UIElementProps) => {
  const { className } = props;

  const [open, setOpen] = useState(false);
  const { redemptions } = useRedemptions();

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
              <div className="restore-tx">
                <div className="restore-tx-inner">
                  Don't see your transaction above?{' '}
                  <Link className="link" to="/bridge/restore">
                    Restore transaction
                  </Link>
                </div>
              </div>
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

  .restore-tx {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: 500;
    color: ${({ theme }) => theme.dimTextColor};
    margin-bottom: 10px;
  }

  .restore-tx-inner {
    width: auto;
  }

  .link {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;
