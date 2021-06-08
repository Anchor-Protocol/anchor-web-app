import { Slider, Switch } from '@material-ui/core';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { useNotification } from 'contexts/notification';
import { useJobs } from 'jobs/Jobs';
import React, { ChangeEvent, useMemo } from 'react';
import styled from 'styled-components';

export interface LiquidationAlertConfigProps {
  className?: string;
}

const marks = [
  { value: 35, label: '35%' },
  { value: 45, label: '45%' },
  { value: 40, label: '40%' },
  { value: 49, label: '49%' },
];

function valueLabelFormat(value: number) {
  return value + '%';
}

function LiquidationAlertConfigBase({
  className,
}: LiquidationAlertConfigProps) {
  const { status } = useWallet();
  const { permission } = useNotification();
  const { liquidationAlert, updateLiquidationAlert } = useJobs();

  const visible = useMemo(() => {
    return status === WalletStatus.WALLET_CONNECTED && permission === 'granted';
  }, [permission, status]);

  return visible ? (
    <div className={className}>
      <div>
        <Switch
          color="default"
          checked={liquidationAlert.enabled}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateLiquidationAlert({
              ...liquidationAlert,
              enabled: target.checked,
            })
          }
        />
        {liquidationAlert.enabled && (
          <Slider
            track="inverted"
            valueLabelDisplay="auto"
            valueLabelFormat={valueLabelFormat}
            marks={marks}
            value={liquidationAlert.ratio * 100}
            min={35}
            max={49}
            onChange={(_: any, newValue: number) => {
              console.log('LiquidationAlertConfig.tsx..()', newValue);
              updateLiquidationAlert({
                ...liquidationAlert,
                ratio: newValue / 100,
              });
            }}
          />
        )}
      </div>
    </div>
  ) : null;
}

export const LiquidationAlertConfig = styled(LiquidationAlertConfigBase)`
  border: 1px solid black;
  border-radius: 10px;

  padding: 20px;
  margin-top: 20px;

  > div {
    display: flex;
    align-items: center;

    padding: 0 20px;
    gap: 30px;
  }
`;
