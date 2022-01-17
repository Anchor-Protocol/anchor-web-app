import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface TermsMessageBaseProps {
  className?: string;
}

function TermsMessageBase({ className }: TermsMessageBaseProps) {
  return (
    <p className={className}>
      By connecting, I accept Anchor's <Link to="/terms">Terms of Service</Link>
    </p>
  );
}

export const TermsMessage = styled(TermsMessageBase)`
  margin-top: 1.5em;

  font-size: 11px;
  line-height: 1.5;

  color: ${({ theme }) => theme.dimTextColor};

  a {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.positive};
  }
`;
