import {
  createBroadcastingOption,
  useBroadcasting,
} from '@anchor-protocol/broadcastable-operation';
import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface BroadcastingContainerProps {
  className?: string;
}

const broadcastingOptions = createBroadcastingOption({
  map: ({ id, rendering }) => <div key={id}>{rendering}</div>,
  //displayTime: 5000,
});

function BroadcastingContainerBase({ className }: BroadcastingContainerProps) {
  const renderings = useBroadcasting(broadcastingOptions);

  return <div className={className}>{renderings}</div>;
}

const enter = keyframes`
  0% {
    opacity: 0.1;
    transform: scale(0.4);
  }
  
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const BroadcastingContainer = styled(BroadcastingContainerBase)`
  position: fixed;
  right: 1em;
  bottom: 60px;

  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1em;

  > div {
    font-size: 10px;

    min-width: 300px;
    background-color: ${({ theme }) => theme.backgroundColor};
    padding: 3em;
    border-radius: 1em;

    box-shadow: 0px 0px 21px 4px rgba(0, 0, 0, 0.3);

    animation: ${enter} 0.5s ease-in-out;
  }
`;
