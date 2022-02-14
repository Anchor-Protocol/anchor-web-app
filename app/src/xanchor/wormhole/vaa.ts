import { ChainId, getSignedVAA } from '@certusone/wormhole-sdk';
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';

export const pollSignedVAA = async (
  emitterChain: ChainId,
  emitterAddress: string,
  sequence: number,
) => {
  while (true) {
    try {
      const { vaaBytes } = await getSignedVAA(
        'https://wormhole-v2-testnet-api.certus.one',
        emitterChain,
        emitterAddress,
        sequence.toString(),
        {
          transport: NodeHttpTransport(),
        },
      );

      if (vaaBytes !== undefined) {
        return vaaBytes;
      }
    } catch (e) {}

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

const HEADER_LEN = 6;
const SIG_LEN = 66;
const PAYLOAD_POS = 51;

export function parseVAA(vaa: Uint8Array): Uint8Array {
  let buffer = Buffer.from(vaa);
  let numSigs = buffer.readUInt8(5);
  let bodyOffset = HEADER_LEN + numSigs * SIG_LEN;
  let payload = vaa.slice(bodyOffset + PAYLOAD_POS);
  return payload;
}

const SEQ_POS = 34;
export function parseSequenceFromPayload(payload: Uint8Array): number {
  let buffer = Buffer.from(payload);
  let sequence = buffer.readBigUInt64BE(SEQ_POS);
  return Number(sequence);
}

export const extractSeqFromResponseTerra = (vaa: Uint8Array) => {
  return parseSequenceFromPayload(parseVAA(vaa));
};
