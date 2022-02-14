import { CrossAnchorSdk } from 'xanchor/base';
import { Web3Provider } from '@ethersproject/providers';
import { EthCrossAnchorBridge } from './bridge';
import { ChainId, getEmitterAddressEth } from '@certusone/wormhole-sdk';

export class EthCrossAnchorSdk extends CrossAnchorSdk {
  private ethCrossAnchorBridge: EthCrossAnchorBridge;
  private chainId: ChainId;

  constructor(chainId: ChainId, provider: Web3Provider) {
    super();
    this.chainId = chainId;
    this.ethCrossAnchorBridge = new EthCrossAnchorBridge(chainId, provider);
  }

  protected _crossAnchorBridge(): EthCrossAnchorBridge {
    return this.ethCrossAnchorBridge;
  }

  protected _chainId(): ChainId {
    return this.chainId;
  }

  protected _crossAnchorBridgeAddress(): string {
    return '0x6BC753dDDa20488767ad501B06382398587df251';
  }

  protected _tokenBridgeAddress(): string {
    return '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5';
  }

  protected _depositStable(
    token: string,
    amount: string,
  ): Promise<[number, number]> {
    return this.ethCrossAnchorBridge.depositStable(token, amount);
  }

  protected _emitterAddress(contract: string): Promise<string> {
    return new Promise((resolve) =>
      resolve(getEmitterAddressEth(Number(contract))),
    );
  }
}
