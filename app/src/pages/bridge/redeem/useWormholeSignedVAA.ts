import { useEffect, useState } from 'react';
import {
  CHAIN_ID_ETHEREUM_ROPSTEN,
  getEmitterAddressEth,
  getSignedVAAWithRetry,
} from '@certusone/wormhole-sdk';

type WormholeSignedVAAReturn = {
  loading: boolean;
  vaaBytes?: Uint8Array;
};

// need to make these work from the chain specifications, maybe we need
// a chain configuration where all this information is stored
const EMITTER_ADDRESS = '0xF174F9A837536C449321df1Ca093Bb96948D5386';
const WORMHOLE_RPC_HOSTS = ['https://wormhole-v2-testnet-api.certus.one'];

const useWormholeSignedVAA = (
  chainId: number,
  sequence: string,
): WormholeSignedVAAReturn => {
  const [response, setResponse] = useState<WormholeSignedVAAReturn>({
    loading: true,
  });

  useEffect(() => {
    (async () => {
      //const emitterAddress = getEmitterAddressEth(getTokenBridgeAddressForChain(CHAIN_ID_ETHEREUM_ROPSTEN));
      const emitterAddress = getEmitterAddressEth(EMITTER_ADDRESS);
      const vaa = await getSignedVAAWithRetry(
        WORMHOLE_RPC_HOSTS,
        CHAIN_ID_ETHEREUM_ROPSTEN,
        emitterAddress,
        sequence,
        undefined,
        undefined,
        100,
      );
      setResponse({
        loading: false,
        vaaBytes: vaa.vaaBytes,
      });
    })();
  }, [chainId, sequence]);

  // setTimeout(() => {
  //   setResponse({
  //     loading: false,
  //     vaa: hexToUint8Array(
  //       '01000000000100a580457c2032557058bef24d605af2aab6300b3a43e2452e5e53a51bfcec579f16ba15a16c93b5599f0cb388ac5ed45c2a1767ad10e1a57e06ea014c30ca26b200620620c0000153c900030000000000000000000000000c32d68d8f22613f6b9511872dad35a59bfdf7f0000000000000016d0001000000000000000000000000000000000000000000000000000000001dcd65000100000000000000000000000000000000000000000000000000000075757364000300000000000000000000000029c46471b286a3769f786ee089fdde63bdb2480c27110000000000000000000000000000000000000000000000000000000000000000',
  //     ),
  //   });
  // }, 3000);

  return response;
};

export { useWormholeSignedVAA };
