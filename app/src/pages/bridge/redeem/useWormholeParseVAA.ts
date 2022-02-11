import { useState, useEffect } from 'react';
//import { importCoreWasm } from '@certusone/wormhole-sdk/lib/cjs/solana/wasm';

type WormholeParseVAA = (data: Uint8Array) => any;

const useWormholeParseVAA = (): WormholeParseVAA | undefined => {
  const [parser, setParser] = useState<WormholeParseVAA | undefined>();
  useEffect(() => {
    (async () => {
      // const { parse_vaa } = await importCoreWasm();
      // setParser(parse_vaa);
      const { parse_vaa } = await import(
        '@certusone/wormhole-sdk/lib/esm/solana/core/bridge'
      );
      setParser(parse_vaa);
    })();
  }, []);
  return parser;
};

export { useWormholeParseVAA };
