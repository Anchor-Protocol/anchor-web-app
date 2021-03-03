import styled from 'styled-components';

export interface ClaimAncUstLpProps {
  className?: string;
}

function ClaimAncUstLpBase({ className }: ClaimAncUstLpProps) {
  return <div className={className}>...</div>;
}

export const ClaimAncUstLp = styled(ClaimAncUstLpBase)`
  // TODO
`;
