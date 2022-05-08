import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { VStack } from '@libs/ui/Stack';
import { useDialog } from '@libs/use-dialog';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { millisecondsInSecond } from 'date-fns';
import { useMyVotingLockPeriodEndsAtQuery } from 'queries';
import { useVotingEscrowConfigQuery } from 'queries/gov/useVotingEscrowConfigQuery';
import React from 'react';
import { ExtendAncLockPeriodDialog } from './ExtendAncLockPeriodDialog';

export const ExtendAncLockPeriod = () => {
  const [openExtendAncLockPeriodDialog, extendAncLockPeriodDialog] = useDialog(
    ExtendAncLockPeriodDialog,
  );

  const { data: unlockAt } = useMyVotingLockPeriodEndsAtQuery();
  const { data: lockConfig } = useVotingEscrowConfigQuery();

  if (!unlockAt || !lockConfig) {
    return null;
  }

  const currentPeriod = (unlockAt - Date.now()) / millisecondsInSecond;
  const isMaxedOut =
    currentPeriod > lockConfig.maxLockTime - lockConfig.periodDuration;

  const button = (
    <BorderButton
      style={{ flex: 1 }}
      disabled={isMaxedOut}
      onClick={openExtendAncLockPeriodDialog}
    >
      Extend
    </BorderButton>
  );

  return (
    <>
      <ViewAddressWarning>
        {isMaxedOut ? (
          <Tooltip
            title="You already have a maximum lock period"
            placement="bottom"
          >
            <VStack>{button}</VStack>
          </Tooltip>
        ) : (
          button
        )}
      </ViewAddressWarning>
      {extendAncLockPeriodDialog}
    </>
  );
};
