import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface LogoProps {
  className?: string;
}

function LogoBase({ className }: LogoProps) {
  return (
    <Link className={className} to="/">
      ANCHOR
    </Link>
  );
}

export const Logo = styled(LogoBase)`
  font-size: 13px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.8);
`;
