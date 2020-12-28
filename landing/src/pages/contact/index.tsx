import styled from 'styled-components';

export interface ContactProps {
  className?: string;
}

function ContactBase({ className }: ContactProps) {
  return <div className={className}>...</div>;
}

export const Contact = styled(ContactBase)`
  // TODO
`;