import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { useDialog } from '@libs/use-dialog';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import React from 'react';
import { ExtendAncLockPeriodDialog } from './ExtendAncLockPeriodDialog';

export const ExtendAncLockPeriod = () => {
  const [openExtendAncLockPeriodDialog, extendAncLockPeriodDialog] = useDialog(
    ExtendAncLockPeriodDialog,
  );

  return (
    <>
      <ViewAddressWarning>
        <BorderButton onClick={openExtendAncLockPeriodDialog}>
          Extend
        </BorderButton>
      </ViewAddressWarning>
      {extendAncLockPeriodDialog}
    </>
  );
};
