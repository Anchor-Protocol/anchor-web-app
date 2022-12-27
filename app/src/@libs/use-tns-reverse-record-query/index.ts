import { LCDClient } from '@terra-money/terra.js';
import { useWallet } from '@terra-money/use-wallet';
import { useMemo } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

const REVERSE_RECORD_ADDRESS = 'terra13efj2whf6rm7yedc2v7rnz0e6ltzytyhydy98a';
enum TNS_QUERY_KEY {
  REVERSE_RECORD = 'TNS_QUERY_REVERSE_RECORD',
}

export function useTnsReverseRecordQuery(
  walletAddress: string,
): UseQueryResult<string | null> {
  const wallet = useWallet();
  const network = wallet?.network;
  const lcd = useMemo(() => {
    if (!network) {
      return null;
    }
    return new LCDClient({
      chainID: network.chainID,
      URL: network.lcd,
    });
  }, [network]);

  const result = useQuery(
    [
      TNS_QUERY_KEY.REVERSE_RECORD,
      walletAddress ?? undefined,
      REVERSE_RECORD_ADDRESS,
    ],
    async () => {
      if (!lcd || network?.chainID !== 'columbus-5') {
        return null;
      }
      try {
        const res = await lcd.wasm.contractQuery<{ name: string }>(
          REVERSE_RECORD_ADDRESS,
          {
            get_name: {
              address: walletAddress,
            },
          },
        );
        return res?.name;
      } catch (error) {
        return null;
      }
    },
    {
      enabled: !!walletAddress,
    },
  );
  return result;
}
