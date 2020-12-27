import styled from 'styled-components';

export interface FooterProps {
  className?: string;
}

function FooterBase({ className }: FooterProps) {
  return <div className={className}>...</div>;
}

export const Footer = styled(FooterBase)`
  // TODO
`;