import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { Overview } from './components/Overview';
import { Polls } from './components/Polls';
import { Rewards } from './components/Rewards';
import styled from 'styled-components';

export interface GovernmentMainProps {
  className?: string;
}

function GovernmentMainBase({ className }: GovernmentMainProps) {
  return (
    <PaddedLayout className={className}>
      <Overview className="overview" />
      <Rewards className="rewards" />
      <Polls className="polls" />
    </PaddedLayout>
  );
}

export const GovernmentMain = styled(GovernmentMainBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  header {
    display: flex;
    align-items: center;

    margin: 80px 0 30px 0;

    div:empty {
      flex: 1;
    }

    h2 {
      font-size: 18px;
      font-weight: 700;
    }

    select {
      height: 40px;
    }

    button {
      width: 180px;
      height: 48px;
      border-radius: 26px;
      margin-left: 10px;
    }
  }
`;
