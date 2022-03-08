import React, { useState } from 'react';
import { UIElementProps } from '@libs/ui';
import { ClickAwayListener } from '@material-ui/core';
import styled from 'styled-components';
import { TransactionButton } from './TransactionButton';
import { DropdownBox, DropdownContainer } from '../desktop/DropdownContainer';
import { TransactionList } from './TransactionList';
import { Link } from 'react-router-dom';
import { useTransactions } from 'tx/evm/storage/useTransactions';

const TransactionWidgetBase = (props: UIElementProps) => {
  const { className } = props;

  const [open, setOpen] = useState(false);
  const { transactions } = useTransactions();

  if (transactions.length === 0) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={className}>
        <TransactionButton onClick={() => setOpen((v) => !v)} />
        {open && (
          <DropdownContainer>
            <DropdownBox>
              <TransactionList onClose={() => setOpen((v) => !v)} />
              <div className="restore-tx">
                <div className="restore-tx-inner">
                  <span>Having transaction issues?</span>
                  <Link
                    className="link"
                    to="/bridge/restore"
                    onClick={() => setOpen(false)}
                  >
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

export const TransactionWidget = styled(TransactionWidgetBase)`
  display: inline-block;
  position: relative;
  text-align: left;

  .restore-tx {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 500;
    color: ${({ theme }) => theme.dimTextColor};
    margin-bottom: 10px;
  }

  .restore-tx-inner {
    width: auto;
    display: flex;
  }

  .link {
    margin-left: 5px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;
