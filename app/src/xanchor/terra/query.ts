import { terra } from './client';

export const outgoingSequence = async (incomingSequence: number) => {
  let sequence_info = await terra.wasm.contractQuery('terra_xanchor_bridge', {
    sequence_info: {
      chain_id: 'CHAIN_ID_ETHEREUM_ROPSTEN',
      sequence: incomingSequence,
    },
  });

  // @ts-ignore
  return parseInt(sequence_info.outgoing_sequence);
};
