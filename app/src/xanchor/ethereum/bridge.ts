import {
  CrossAnchorBridge,
  CrossAnchorBridge__factory,
  IERC20,
  IERC20__factory,
} from '@libs/evm-contracts';
import { Web3Provider } from '@ethersproject/providers';
import { Bridge } from 'xanchor/base';
import { ContractReceipt, VoidSigner } from 'ethers';
import { getAddress } from 'configurations/addresses';
import { Interface } from 'ethers/lib/utils';
import { ChainId } from '@certusone/wormhole-sdk';

export class EthCrossAnchorBridge implements Bridge {
  crossAnchorBridgeContract: CrossAnchorBridge;
  ustContract: IERC20;

  constructor(chainId: ChainId, provider: Web3Provider) {
    const crossAnchorBridgeAddress = getAddress('crossAnchorBridge', chainId);
    const ustAddress = getAddress('ust', chainId);

    this.crossAnchorBridgeContract = CrossAnchorBridge__factory.connect(
      crossAnchorBridgeAddress,
      provider
        ? provider.getSigner()
        : new VoidSigner(crossAnchorBridgeAddress),
    );

    this.ustContract = IERC20__factory.connect(
      ustAddress,
      provider ? provider.getSigner() : new VoidSigner(ustAddress),
    );
  }

  // TODO: add approval preflight
  async depositStable(
    token: string,
    amount: string,
  ): Promise<[number, number]> {
    const tx = await this.crossAnchorBridgeContract.depositStable(
      token,
      amount,
    );
    const receipt = await tx.wait();
    return this.parseSequencesFromEthLogs(receipt) as [number, number];
  }

  processTokenTransferInstruction(
    actionVAA: Uint8Array,
    tokenTransferVAA: Uint8Array,
  ): Promise<any> {
    return this.crossAnchorBridgeContract.processTokenTransferInstruction(
      actionVAA,
      tokenTransferVAA,
    );
  }

  // private functions

  private parseSequencesFromEthLogs(receipt: ContractReceipt) {
    let abi = [
      'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
    ];
    const bridgeLogs = receipt.logs.filter((l) => {
      return l.address === 'eth_wormhole';
    });
    let iface = new Interface(abi);
    let res: any[] = [];
    for (const log of bridgeLogs) {
      res.push(iface.parseLog(log).args.sequence.toString());
    }
    return res;
  }
}
