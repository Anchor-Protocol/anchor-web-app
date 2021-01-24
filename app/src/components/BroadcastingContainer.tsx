import styled from 'styled-components';

export interface BroadcastingContainerProps {
  className?: string;
}

function BroadcastingContainerBase({ className }: BroadcastingContainerProps) {
  return <div className={className}>...</div>;
}

export const BroadcastingContainer = styled(BroadcastingContainerBase)`
  // TODO
`;
