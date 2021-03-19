import { FlatButton } from '@terra-dev/neumorphism-ui/components/FlatButton';
import airdropImage from 'components/Header/assets/airdrop.svg';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const parachute = keyframes`
  0% {
    transform: rotate(10deg) translateY(0);
  }
  
  25% {
    transform: rotate(-10deg) translateY(-3px);
  }
  
  50% {
    transform: rotate(10deg) translateY(0);
  }
  
  75% {
    transform: rotate(-10deg) translateY(3px);
  }
  
  100% {
    transform: rotate(10deg) translateY(0);
  }
`;

function AirdropBase({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img src={airdropImage} alt="Airdrop!" />
      <h2>Airdrop</h2>
      <p>Claim your ANC tokens</p>
      <FlatButton component={Link} to="/airdrop">
        Claim
      </FlatButton>
    </div>
  );
}

export const AirdropContent = styled(AirdropBase)`
  margin: 30px;
  text-align: center;

  img {
    animation: ${parachute} 6s ease-in-out infinite;
  }

  h2 {
    margin-top: 13px;

    font-size: 16px;
    font-weight: 500;
  }

  p {
    margin-top: 5px;

    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.dimTextColor};
  }

  a {
    margin-top: 15px;

    width: 100%;
    height: 28px;

    background-color: ${({ theme }) => theme.colors.positive};
  }
`;
