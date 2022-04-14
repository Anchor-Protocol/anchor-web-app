import { useDialog } from '@libs/use-dialog';
import { ReactNode, useCallback } from 'react';
import { CreateReadOnlyWalletDialog } from '../CreateReadOnlyWalletDialog';
import { isAddress } from '@ethersproject/address';
import {
  ConnectType,
  SupportedChainIdsByChain,
  SupportedChainName,
  SupportedEvmChain,
  useWeb3React,
} from '@libs/evm-wallet';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { EvmChainId } from '@anchor-protocol/crossanchor-sdk';
import { ReadOnlyConnector } from '@libs/evm-wallet/connectors/ReadOnlyConnector';

type RequestReadOnlyWalletCreationFlow = () => Promise<void>;

type UseCreateReadOnlyWalletResult = [
  RequestReadOnlyWalletCreationFlow,
  ReactNode,
];

export function useCreateEvmReadOnlyWallet(): UseCreateReadOnlyWalletResult {
  const [openDialog, dialog] = useDialog(CreateReadOnlyWalletDialog);

  const { connect } = useWeb3React();

  const {
    target: { chain },
  } = useDeploymentTarget();

  const requestReadOnlyWalletCreationFlow: RequestReadOnlyWalletCreationFlow =
    useCallback(async () => {
      const networks = SupportedChainIdsByChain[chain as SupportedEvmChain].map(
        (chainId) => ({
          chainId: chainId.toString(),
          name: SupportedChainName[chainId],
        }),
      );
      const readonlyWallet = await openDialog({
        networks,
        validateAddress: isAddress,
      });

      if (readonlyWallet !== null) {
        const { chainId: stringifiedChainId, address } = readonlyWallet;
        const chainId = Number(stringifiedChainId) as EvmChainId;

        const connector = connect(ConnectType.ReadOnly) as ReadOnlyConnector;
        await connector.activate({ chainId, account: address });
      }
    }, [chain, connect, openDialog]);

  return [requestReadOnlyWalletCreationFlow, dialog];
}
