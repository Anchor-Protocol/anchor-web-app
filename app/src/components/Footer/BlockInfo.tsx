import React from 'react';
import styled from 'styled-components';
import { UIElementProps } from 'components/layouts/UIElementProps';
import { Led } from './Led';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';

export interface BlockInfoProps extends UIElementProps {
  chainName: string;
  networkName?: string;
  blockNumber: number;
}

const BlockInfoBase = (props: BlockInfoProps) => {
  const { className, chainName, networkName, blockNumber } = props;
  return (
    <Tooltip title={`The latest block for ${chainName}`} placement="top">
      <div className={className}>
        <Led className="led" blockNumber={blockNumber} />{' '}
        {networkName && networkName.toLowerCase().indexOf('mainnet') !== 0 && (
          <b className="text">[{networkName.toUpperCase()}] </b>
        )}
        <span className="text">{blockNumber}</span>
      </div>
    </Tooltip>
  );
};

export const BlockInfo = styled(BlockInfoBase)`
  display: flex;
  flex-direction: row;
  align-items: center;
  .led {
    margin-top: 1px;
  }
  .text {
    margin-left: 7px;
    text-align: center;
  }
`;
