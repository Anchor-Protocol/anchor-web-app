import React, { useCallback, useState } from 'react';
import { UIElementProps } from '@libs/ui';
import { ClickAwayListener } from '@material-ui/core';
import styled, { useTheme } from 'styled-components';
import { TransactionButton } from './TransactionButton';
import { DropdownBox, DropdownContainer } from '../desktop/DropdownContainer';
import { TransactionList } from './TransactionList';
import { Chain, useDeploymentTarget } from '@anchor-protocol/app-provider';
import { useBackgroundTransactions } from 'tx/evm/storage/useBackgroundTransactions';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { useNavigate } from 'react-router-dom';
import { screen } from 'env';

const TransactionWidgetBase = (props: UIElementProps & { color?: string }) => {
  const theme = useTheme();
  const { className, color = theme.header.textColor } = props;

  const [open, setOpen] = useState(false);
  const { backgroundTransactions } = useBackgroundTransactions();

  const {
    target: { chain },
  } = useDeploymentTarget();

  const navigate = useNavigate();
  const restoreTx = useCallback(() => {
    setOpen(false);
    navigate('/bridge/restore');
  }, [navigate, setOpen]);

  if (backgroundTransactions.length === 0 || chain === Chain.Terra) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={className}>
        <TransactionButton
          color={color}
          backgroundTransactions={backgroundTransactions}
          onClick={() => setOpen((v) => !v)}
          closeWidget={() => setOpen(false)}
        />
        {open && (
          <DropdownContainer className="transaction-dropdown">
            <DropdownBox>
              <TransactionList
                backgroundTransactions={backgroundTransactions}
                onClose={() => setOpen((v) => !v)}
                footer={
                  <div className="restore-tx">
                    <div>Having transaction issues?</div>
                    <BorderButton onClick={restoreTx}>
                      Restore transaction
                    </BorderButton>
                  </div>
                }
              />
            </DropdownBox>
          </DropdownContainer>
        )}
      </div>
    </ClickAwayListener>
  );
};

export const TransactionWidget = styled(TransactionWidgetBase)`
  display: inline-block;
  position: relative;
  text-align: left;

  .restore-tx {
    color: ${({ theme }) => theme.textColor};
    font-size: 12px;

    button {
      margin-top: 10px;
      width: 100%;
      font-weight: 500;
      font-size: 12px;
      margin-bottom: 8px;
      height: 25px !important;
    }
  }

  @media (max-width: ${screen.mobile.max}px) {
    .transaction-dropdown {
      right: -150px;
    }
  }
`;
