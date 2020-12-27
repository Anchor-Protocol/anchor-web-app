import styled from 'styled-components';

export interface BAssetsProps {
  className?: string;
}

function BAssetsBase({ className }: BAssetsProps) {
  return <div className={className}>...</div>;
}

export const BAssets = styled(BAssetsBase)`
  // TODO
`;