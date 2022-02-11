import type { ReactNode } from 'react';
import type { OpenDialog } from '@libs/use-dialog';
import { useDialog } from '@libs/use-dialog';
import { DepositDialog } from './DepositDialog';
import { FormParams, FormReturn } from './types';

export function useDepositDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog<FormParams, FormReturn>(DepositDialog);
}
