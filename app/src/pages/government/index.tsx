import styled from 'styled-components';

export interface GovernmentProps {
  className?: string;
}

function GovernmentBase({ className }: GovernmentProps) {
  return <div className={className}>...</div>;
}

export const Government = styled(GovernmentBase)`
  // TODO
`;
