import {
  createBroadcastingOption,
  useBroadcasting,
} from '@anchor-protocol/broadcastable-operation';
import styled from 'styled-components';

export interface BroadcastContainerProps {
  className?: string;
}

const broadcastingOptions = createBroadcastingOption({
  map: ({ id, rendering }) => <li key={id}>{rendering}</li>,
});

function BroadcastContainerBase({ className }: BroadcastContainerProps) {
  const renderings = useBroadcasting(broadcastingOptions);

  return <ul className={className}>{renderings}</ul>;
}

export const BroadcastingContainer = styled(BroadcastContainerBase)`
  position: fixed;
  right: 1em;
  bottom: 1em;

  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column-reverse;
  gap: 1em;

  li {
    min-width: 300px;
    border: 5px solid deepskyblue;
    padding: 1em;
  }
`;
