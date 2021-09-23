import { MAINTANANCE_DOWN_BLOCK } from '@anchor-protocol/webapp-fns';
import { useTerraWebapp } from '@libs/webapp-provider';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

export function Maintanance() {
  return <div>Maintanance page...</div>;
}

export function MaintanaceRoute() {
  const { lastSyncedHeight } = useTerraWebapp();

  const [shutdown, setShutdown] = useState<boolean>(false);

  useEffect(() => {
    if (typeof MAINTANANCE_DOWN_BLOCK === 'number' && !shutdown) {
      const block = MAINTANANCE_DOWN_BLOCK;
      const intervalId = setInterval(() => {
        lastSyncedHeight().then((blockHeight) => {
          if (blockHeight > block) {
            setShutdown(true);
          }
        });
      }, 1000 * 10);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [lastSyncedHeight, shutdown]);

  return shutdown ? <Redirect to="/maintanace" /> : null;
}
