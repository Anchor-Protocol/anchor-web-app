import { FormReturn, useForm } from '@libs/use-form';
import { useCallback } from 'react';

export interface RestoreTxFormInput {
  txHash: string;
}

export interface RestoreTxFormStates extends RestoreTxFormInput {}

export interface RestoreTxFormAsyncStates {}

export const useRestoreTxForm = () => {
  const restoreForm = useCallback(
    () =>
      ({
        txHash,
      }: RestoreTxFormInput): FormReturn<
        RestoreTxFormStates,
        RestoreTxFormAsyncStates
      > => {
        return [
          {
            txHash,
          },
          undefined,
        ];
      },
    [],
  );

  return useForm(restoreForm, {}, () => ({ txHash: '' }));
};
