import { useTerraWebapp } from '@libs/webapp-provider';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

export function Maintanance() {
  return <div>Maintanance page...</div>;
}

// TODO change block height
const SHUTDOWN_BLOCK_HEIGHT = 4_724_000;

export function MaintanaceRoute() {
  const { lastSyncedHeight } = useTerraWebapp();

  const [shutdown, setShutdown] = useState<boolean>(false);

  useEffect(() => {
    if (!shutdown) {
      const intervalId = setInterval(() => {
        lastSyncedHeight().then((blockHeight) => {
          if (blockHeight > SHUTDOWN_BLOCK_HEIGHT) {
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
