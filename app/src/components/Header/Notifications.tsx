import { MICRO, toFixedNoRounding } from '@anchor-protocol/notation';
import { ClickAwayListener, IconButton } from '@material-ui/core';
import { NotificationImportant, NotificationsNone } from '@material-ui/icons';
import big from 'big.js';
import { useBank } from 'contexts/bank';
import { fixedGasUUSD } from 'env';
import { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';

export interface NotificationsProps {
  className?: string;
}

function NotificationsBase({ className }: NotificationsProps) {
  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [open, setOpen] = useState(false);

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const invalidUUSDBalanceLowerThanFixedGas = useMemo<ReactNode>(() => {
    if (big(bank.userBalances.uUSD).lt(fixedGasUUSD)) {
      return (
        <li>
          <p>Not enough uusd balance than fixed gas.</p>
          <p>
            your usd balance ={' '}
            {toFixedNoRounding(big(bank.userBalances.uUSD).div(MICRO))} / fixed
            gas = {toFixedNoRounding(big(fixedGasUUSD).div(MICRO))}
          </p>
        </li>
      );
    }
  }, [bank.userBalances.uUSD]);

  const hasNotification = useMemo<boolean>(() => {
    return !!invalidUUSDBalanceLowerThanFixedGas;
  }, [invalidUUSDBalanceLowerThanFixedGas]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const onClickAway = () => {
    setOpen(false);
  };

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <div className={className} data-notification={hasNotification}>
        <IconButton onClick={toggleOpen}>
          {hasNotification ? <NotificationImportant /> : <NotificationsNone />}
        </IconButton>
        {open ? (
          <ul className="dropdown">
            {invalidUUSDBalanceLowerThanFixedGas || <li>No alram</li>}
          </ul>
        ) : null}
      </div>
    </ClickAwayListener>
  );
}

export const Notifications = styled(NotificationsBase)`
  position: relative;
  display: inline;

  .dropdown {
    list-style: none;
    position: absolute;
    display: block;
    top: 28px;
    right: 0;
    z-index: 1000;
    border: 1px solid white;
    padding: 20px;
    background-color: ${({ theme }) => theme.palette.background.paper};
    word-break: keep-all;
    white-space: nowrap;

    text-align: left;
  }

  &[data-notification='true'] {
    > :first-child {
      color: ${({ theme }) => theme.errorTextColor};
    }
  }
`;
