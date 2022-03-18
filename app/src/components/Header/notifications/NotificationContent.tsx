import { Slider, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { NotificationsNone } from '@material-ui/icons';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { useJobs } from 'jobs/Jobs';
import React, { ChangeEvent, useCallback } from 'react';
import styled, { DefaultTheme } from 'styled-components';

export interface NotificationContentProps {
  className?: string;
}

function valueLabelFormat(value: number) {
  return Math.floor(value) + '%';
}

function createMark(percent: number) {
  return { value: percent, label: percent + '%' };
}

const notificationMin = 75.0;
const notificationMax = 99.0;

const sliderMarks = [createMark(75.0), createMark(87.0), createMark(99.0)];

function NotificationContentBase({ className }: NotificationContentProps) {
  const { liquidationAlert, updateLiquidationAlert } = useJobs();

  const { focusVisible, ...switchClasses } = useSwitchStyle();
  const sliderClasses = useSliderStyle();

  const testNotifications = useCallback(() => {
    new Notification('Anchor Borrow Usage Notification', {
      body: 'Notifications have been enabled.',
    });
  }, []);

  return (
    <div className={className}>
      <h2>
        <NotificationsNone />
        <IconSpan>
          Notification{' '}
          <InfoTooltip>
            Currently notifications only support desktop browsers and require
            the webapp to be open in a tab
          </InfoTooltip>
        </IconSpan>
      </h2>

      <div className="switch">
        <p>Anchor Borrow Usage</p>
        <Switch
          focusVisibleClassName={focusVisible}
          classes={switchClasses}
          checked={liquidationAlert.enabled}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateLiquidationAlert({
              ...liquidationAlert,
              enabled: target.checked,
            })
          }
        />
      </div>

      {liquidationAlert.enabled && (
        <Slider
          classes={sliderClasses}
          valueLabelDisplay="on"
          valueLabelFormat={valueLabelFormat}
          marks={sliderMarks}
          value={liquidationAlert.ratio * 100}
          min={notificationMin}
          max={notificationMax}
          onChange={(_: any, newValue: number) => {
            updateLiquidationAlert({
              ...liquidationAlert,
              ratio: newValue / 100,
            });
          }}
        />
      )}

      {liquidationAlert.enabled && (
        <ActionButton
          className="test-notifications"
          onClick={testNotifications}
        >
          Test Notifications
        </ActionButton>
      )}
    </div>
  );
}

const useSwitchStyle = makeStyles((theme: DefaultTheme) => ({
  root: {
    width: 40,
    height: 22,
    padding: 0,
    margin: 0,
  },
  switchBase: {
    'padding': 1,
    '&$checked': {
      'transform': 'translateX(18px)',
      'color': theme.palette.common.white,
      '& + $track': {
        backgroundColor: theme.colors.positive,
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: theme.colors.positive,
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 20,
    height: 20,
    color: theme.palette.common.white,
  },
  track: {
    borderRadius: 26 / 2,
    backgroundColor: theme.dimTextColor,
    opacity: 1,
    transition: theme.transitions.create(['background-color']),
  },
  checked: {},
  focusVisible: {},
}));

const useSliderStyle = makeStyles((theme: DefaultTheme) => ({
  root: {
    color: theme.textColor,
    height: 8,
  },
  thumb: {
    'height': 16,
    'width': 16,
    'backgroundColor': theme.colors.positive,
    'border': '3px solid currentColor',
    'marginTop': -6,
    'marginLeft': -8,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  mark: {
    visibility: 'hidden',
  },
  markLabel: {
    'fontSize': 12,

    '&[data-index="0"]': {
      transform: 'translateX(0)',
    },

    '&[data-index="3"]': {
      transform: 'translateX(-100%)',
    },
  },
  valueLabel: {
    'left': 'calc(-100% - 10px)',
    '&> span': {
      'transform': 'translateY(7px)',
      'backgroundColor': theme.colors.positive,
      'borderRadius': 22,
      'width': 48,
      'height': 23,

      '&> span': {
        transform: 'none',
        color: theme.textColor,
      },
    },
  },
  track: {
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.textColor,
  },
  rail: {
    height: 3,
    borderRadius: 2,
    opacity: 1,
  },
}));

export const NotificationContent = styled(NotificationContentBase)`
  width: 100%;

  h2 {
    font-size: 13px;
    font-weight: 500;

    color: ${({ theme }) => theme.dimTextColor};

    display: flex;
    align-items: center;

    > svg:first-child {
      font-size: 1.4em;
      margin-right: 0.2em;
    }

    margin-bottom: 6px;
  }

  .switch {
    font-size: 18px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 40px;
  }

  .test-notifications {
    margin-top: 10px;

    width: 100%;
    height: 36px;
    font-size: 13px;
  }
`;
