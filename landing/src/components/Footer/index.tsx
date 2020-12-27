import styled from 'styled-components';

export interface FooterProps {
  className?: string;
}

function FooterBase({ className }: FooterProps) {
  return <div className={className}>Footer</div>;
}

export const Footer = styled(FooterBase)`
  background-color: #000000;
  color: #ffffff;
  
  height: 50px;
  
  display: grid;
  place-items: center;
`;