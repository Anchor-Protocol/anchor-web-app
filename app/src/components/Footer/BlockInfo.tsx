import React from 'react';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { FiberManualRecord } from '@material-ui/icons';

export interface BlockInfoProps {
  chainName: string;
  networkName?: string;
  blockNumber: number;
}

export const BlockInfo = ({
  chainName,
  networkName,
  blockNumber,
}: BlockInfoProps): React.ReactElement => (
  <IconSpan>
    <FiberManualRecord className="point" />{' '}
    {networkName && networkName.toLowerCase().indexOf('mainnet') !== 0 && (
      <b>[{networkName.toUpperCase()}] </b>
    )}
    Latest{chainName && ` ${chainName}`} Block: {blockNumber}{' '}
  </IconSpan>
);
