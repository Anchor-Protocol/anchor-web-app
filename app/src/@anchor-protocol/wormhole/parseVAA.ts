import Big from 'big.js';

const skipHeader = (buffer: Buffer): Buffer => {
  const VERSION_LEN = 1;
  const GAURDIAN_SET_INDEX_LEN = 4;

  const lenSignatures = buffer.readUInt8(VERSION_LEN + GAURDIAN_SET_INDEX_LEN);

  return buffer.slice(6 + lenSignatures * 66);
};

interface VAA {
  timestamp: number;
  sequence: number;
  payload: Buffer;
}

const parseVAA = (vaaBytes: Uint8Array): VAA => {
  // https://docs.wormholenetwork.com/wormhole/vaas

  const buffer = skipHeader(Buffer.from(vaaBytes));

  const timestamp = buffer.readUInt32BE();

  const sequence = new Big(
    (buffer.readUInt32BE(42) >> 32) | buffer.readUInt32BE(46),
  );

  return {
    timestamp,
    sequence: sequence.toNumber(),
    payload: buffer.slice(51),
  };
};

export { parseVAA };
