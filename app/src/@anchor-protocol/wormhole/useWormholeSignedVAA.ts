import { useEffect, useState } from 'react';
import {
  CHAIN_ID_TERRA,
  getEmitterAddressTerra,
  //getTokenBridgeAddressForChain,
  getSignedVAAWithRetry,
} from '@certusone/wormhole-sdk';

type WormholeSignedVAAReturn = {
  loading: boolean;
  vaaBytes?: Uint8Array;
};

// need to make these work from the chain specifications, maybe we need
// a chain configuration where all this information is stored
const EMITTER_ADDRESS = 'terra1pseddrv0yfsn76u4zxrjmtf45kdlmalswdv39a';
const WORMHOLE_RPC_HOSTS = ['https://wormhole-v2-testnet-api.certus.one'];

const useWormholeSignedVAA = (
  chainId: string,
  sequence: string,
): WormholeSignedVAAReturn => {
  const [response, setResponse] = useState<WormholeSignedVAAReturn>({
    loading: true,
  });

  // console.log(
  //   'getTokenBridgeAddressForChain',
  //   getTokenBridgeAddressForChain(CHAIN_ID_TERRA),
  // );

  useEffect(() => {
    (async () => {
      //const emitterAddress = getEmitterAddressTerra(getTokenBridgeAddressForChain(CHAIN_ID_TERRA));
      const emitterAddress = await getEmitterAddressTerra(EMITTER_ADDRESS);
      const vaa = await getSignedVAAWithRetry(
        WORMHOLE_RPC_HOSTS,
        CHAIN_ID_TERRA,
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

  return response;
};

export { useWormholeSignedVAA };
