import { LCDClient } from '@terra-money/terra.js';
import { useWallet } from '@terra-money/use-wallet';
import { useEffect, useMemo, useState } from 'react';

const REVERSE_RECORD_ADDRESS = 'terra13efj2whf6rm7yedc2v7rnz0e6ltzytyhydy98a';

export const useTnsReverseRecord = (address: string) => {
  const { network } = useWallet();
  const [reverseRecord, setReverseRecord] = useState<string | null>(null);

  const lcd = useMemo(() => {
    return new LCDClient({
      chainID: network.chainID,
      URL: network.lcd,
    });
  }, [network.chainID, network.lcd]);

  useEffect(() => {
    if (network.chainID !== 'columbus-5' || !address) {
      setReverseRecord(null);
      return;
    }
    lcd.wasm
      .contractQuery<{ name: string }>(REVERSE_RECORD_ADDRESS, {
        get_name: {
          address,
        },
      })
      .then((res) => {
        setReverseRecord(res.name);
      })
      .catch((err) => {
        setReverseRecord(null);
      });
  }, [lcd, address, network.chainID]);

  return reverseRecord;
};
