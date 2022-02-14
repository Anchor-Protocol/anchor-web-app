import { BigNumberish } from 'ethers';
import { ChainId, getEmitterAddressTerra } from '@certusone/wormhole-sdk';
import { Bridge } from './bridge';
import { extractSeqFromResponseTerra, pollSignedVAA } from 'xanchor/wormhole';
import { outgoingSequence, processAnchorMessage } from 'xanchor/terra';

export abstract class CrossAnchorSdk {
  protected abstract _crossAnchorBridge(): Bridge;
  protected abstract _chainId(): ChainId;
  protected abstract _crossAnchorBridgeAddress(): string;
  protected abstract _tokenBridgeAddress(): string;
  protected abstract _depositStable(
    token: string,
    amount: BigNumberish,
  ): Promise<[number, number]>;
  protected abstract _emitterAddress(contract: string): Promise<string>;

  public async depositStable(token: string, amount: BigNumberish) {
    return this.executeCrossChainAction(() =>
      this._depositStable(token, amount),
    );
  }

  // private functions

  private async executeCrossChainAction(
    crossChainAction: () => Promise<[number, number]>,
  ) {
    const [remoteActionSeq, remoteTransferSeq] = await crossChainAction();
    const remoteActionVAA = await pollSignedVAA(
      this._chainId(),
      await this._emitterAddress(this._crossAnchorBridgeAddress()),
      remoteActionSeq,
    );
    const remoteTransferVAA = await pollSignedVAA(
      this._chainId(),
      await this._emitterAddress(this._tokenBridgeAddress()),
      remoteTransferSeq,
    );
    // TODO: figure out how to abstract this
    // - users will have to use multiple wallets when interacting with cross anchor?
    // - connectedWallet.post
    await processAnchorMessage(remoteActionVAA, remoteTransferVAA);
    const terraActionSeq = await outgoingSequence(remoteActionSeq);
    // TODO: replace ChainId int (1) with terra mainnet/testnet
    const terraActionVAA = await pollSignedVAA(
      1,
      await getEmitterAddressTerra('terra_cross_anchor_bridge'),
      terraActionSeq,
    );
    const terraTransferSeq = extractSeqFromResponseTerra(terraActionVAA);
    const terraTransferVAA = await pollSignedVAA(
      1,
      await getEmitterAddressTerra('terra_token_bridge'),
      terraTransferSeq,
    );
    return this._crossAnchorBridge().processTokenTransferInstruction(
      terraActionVAA,
      terraTransferVAA,
    );
  }
}
