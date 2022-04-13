import { ReadonlyWalletSession } from '@terra-money/wallet-provider';
import { useDialog } from '@libs/use-dialog';
import { AccAddress } from '@terra-money/terra.js';
import { ReactNode, useCallback } from 'react';
import {
  CreateReadOnlyWalletDialog,
  NetworkInfo,
} from '../CreateReadOnlyWalletDialog';
import { NetworkInfo as TerraNetworkInfo } from '@terra-money/use-wallet';

type RequestReadonlyWalletCreationFlow = (
  networks: TerraNetworkInfo[],
) => Promise<ReadonlyWalletSession | null>;

type UseCreateReadonlyWalletResult = [
  RequestReadonlyWalletCreationFlow,
  ReactNode,
];

export function useCreateReadOnlyWallet(): UseCreateReadonlyWalletResult {
  const [openDialog, dialog] = useDialog(CreateReadOnlyWalletDialog);

  const requestReadonlyWalletCreationFlow: RequestReadonlyWalletCreationFlow =
    useCallback(
      async (terraNetworks) => {
        const networks: NetworkInfo[] = terraNetworks.map(
          ({ chainID, name }) => ({
            chainId: chainID,
            name,
          }),
        );

        const result = await openDialog({
          networks,
          validateAddress: (address: string) => AccAddress.validate(address),
          defaultChainId: networks.find(({ name }) => name.includes('mainnet'))
            ?.chainId,
        });

        if (result === null) {
          return null;
        }

        return {
          terraAddress: result.address,
          network: terraNetworks.find(
            ({ chainID }) => chainID === result.chainId,
          ) as TerraNetworkInfo,
        };
      },
      [openDialog],
    );

  return [requestReadonlyWalletCreationFlow, dialog];
}
