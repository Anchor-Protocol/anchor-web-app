import { landingMobileLayout } from 'env';
import styled from 'styled-components';
import { BetterSavings } from './components/BetterSavings';
import { BetterYield } from './components/BetterYield';
import { EasierIntegrations } from './components/EasierIntegrations';

export interface IndexProps {
  className?: string;
}

function IndexBase({ className }: IndexProps) {
  return (
    <div className={className}>
      {process.env.NODE_ENV !== 'development' && <BetterSavings />}
      <ResponsiveContainer>
        <BetterYield />
        <EasierIntegrations />
      </ResponsiveContainer>
    </div>
  );
}

export const ResponsiveContainer = styled.div`
  width: 100%;

  background-color: #ffffff;
  padding: 60px 40px;

  > :not(:last-child) {
    margin-bottom: 60px;
  }

  @media (max-width: ${landingMobileLayout}px) {
    padding: 0;

    > :not(:last-child) {
      margin-bottom: 0;
    }
  }
`;

export const Index = styled(IndexBase)`
  background-color: #000000;
  color: #ffffff;

  font-size: 60px;

  display: grid;
  place-items: center;
`;
