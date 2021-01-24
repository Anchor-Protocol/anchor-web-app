import styled from 'styled-components';

export interface OperationBroadcastingRendererProps {
  className?: string;
}

function OperationBroadcastingRendererBase({
  className,
}: OperationBroadcastingRendererProps) {
  return <div className={className}>...</div>;
}

export const OperationBroadcastingRenderer = styled(
  OperationBroadcastingRendererBase,
)`
  // TODO
`;
