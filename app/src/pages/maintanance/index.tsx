import { MAINTANANCE_DOWN_BLOCK } from '@anchor-protocol/webapp-fns';
import { useTerraWebapp } from '@libs/webapp-provider';
import React, { ReactElement, useEffect, useState } from 'react';

export function MaintananceBlocker({ children }: { children: ReactElement }) {
  const { lastSyncedHeight } = useTerraWebapp();

  const [maintananceDown, setMaintananceDown] = useState<boolean>(true);

  useEffect(() => {
    if (typeof MAINTANANCE_DOWN_BLOCK === 'number') {
      const downBlockHeight = MAINTANANCE_DOWN_BLOCK;

      function check() {
        lastSyncedHeight().then((blockHeight) => {
          console.log('MAINTANANCE_DOWN', { blockHeight, downBlockHeight });
          setMaintananceDown(blockHeight > downBlockHeight);
        });
      }

      const intervalId = setInterval(check, 1000 * 10);

      check();

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [lastSyncedHeight]);

  return maintananceDown ? <div>Under maintenance...</div> : children;
}
