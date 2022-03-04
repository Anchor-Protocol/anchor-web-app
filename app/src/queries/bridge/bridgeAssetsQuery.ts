import { Chain, DeploymentTarget } from '@anchor-protocol/app-provider';
import { CW20Addr, ERC20Addr, moneyMarket } from '@anchor-protocol/types';
import {
  CHAIN_ID_TERRA,
  getEmitterAddressTerra,
  getForeignAssetEth,
  hexToUint8Array,
} from '@certusone/wormhole-sdk';
import { EvmChainId } from '@libs/evm-wallet';
import { NetworkInfo } from '@terra-money/use-wallet';
import { ethers } from 'ethers';

export type BridgeAssets = Map<CW20Addr, CW20Addr | ERC20Addr>;

export type WhiltelistCollateral =
  moneyMarket.overseer.WhitelistResponse['elems'][0];

export function bridgeAssetsQuery(
  whitelist: WhiltelistCollateral[] | undefined,
  target: DeploymentTarget,
  network: NetworkInfo,
): Promise<BridgeAssets | undefined> {
  if (whitelist === undefined) {
    return Promise.resolve(undefined);
  }

  if (target.isNative) {
    // this will make the code easier later on
    // if we can always rely on this bridge being set
    return Promise.resolve(bridgeTerraAssetsQuery(whitelist));
  }

  if (target.isEVM) {
    return bridgeEvmAssetsQuery(whitelist, target, network);
  }

  throw Error("Oops, something isn't supported here.");
}

function bridgeTerraAssetsQuery(
  whitelist: WhiltelistCollateral[],
): BridgeAssets {
  return new Map<CW20Addr, CW20Addr | ERC20Addr>(
    whitelist.map((elem) => [elem.collateral_token, elem.collateral_token]),
  );
}

async function bridgeEvmAssetsQuery(
  whitelist: WhiltelistCollateral[],
  target: DeploymentTarget,
  network: NetworkInfo,
): Promise<BridgeAssets> {
  const provider = ethers.getDefaultProvider(getEvmChainId(target, network));

  const map = new Map<CW20Addr, CW20Addr | ERC20Addr>();

  for (let collateral of whitelist) {
    //console.log('collateral', collateral)

    const foreignAsset = await getForeignAssetEth(
      // TODO: this needs to be updated to match the network
      '0x61E44E506Ca5659E6c0bba9b678586fA2d729756',
      provider,
      CHAIN_ID_TERRA,
      hexToUint8Array(
        await getEmitterAddressTerra(collateral.collateral_token),
      ),
    );
    //console.log('collateral:foreignAsset', foreignAsset)
    if (
      foreignAsset &&
      foreignAsset !== '0x0000000000000000000000000000000000000000'
    ) {
      map.set(collateral.collateral_token, foreignAsset as ERC20Addr);
    }
  }

  return map;
}

const getEvmChainId = (
  target: DeploymentTarget,
  network: NetworkInfo,
): number | string => {
  switch (target.chain) {
    case Chain.Ethereum:
      return network.name === 'testnet'
        ? EvmChainId.ETHEREUM_ROPSTEN
        : EvmChainId.ETHEREUM;
    case Chain.Avalanche:
      // ethers doesnt recognize many chains
      return network.name === 'testnet'
        ? 'https://api.avax-test.network/ext/bc/C/rpc'
        : 'https://api.avax.network/ext/bc/C/rpc';
  }
  return EvmChainId.ETHEREUM;
};
