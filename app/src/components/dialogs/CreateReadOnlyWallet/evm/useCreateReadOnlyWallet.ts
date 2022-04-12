import { useDialog } from '@libs/use-dialog';
import { ReactNode, useCallback } from 'react';
import {
  CreateReadOnlyWalletDialog,
  NetworkInfo,
} from '../CreateReadOnlyWalletDialog';

interface ReadOnlyWalletSession {
  address: string;
  chainId: string;
}

type RequestReadOnlyWalletCreationFlow = (
  networks: NetworkInfo[],
) => Promise<ReadOnlyWalletSession | null>;

type UseCreateReadOnlyWalletResult = [
  RequestReadOnlyWalletCreationFlow,
  ReactNode,
];

export function useCreateReadOnlyWallet(): UseCreateReadOnlyWalletResult {
  const [openDialog, dialog] = useDialog(CreateReadOnlyWalletDialog);

  const requestReadOnlyWalletCreationFlow: RequestReadOnlyWalletCreationFlow =
    useCallback(
      async (networks) => {
        // TODO: readOnly wallet creation flow
        const result = await openDialog({
          networks,
          validateAddres: (address: string) => true,
        });

        return result;
      },
      [openDialog],
    );

  return [requestReadOnlyWalletCreationFlow, dialog];
}
