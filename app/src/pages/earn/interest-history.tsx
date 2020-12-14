import React from 'react';
import Box from '../../components/box';
import Apy from './interest-history/apy';
import InterestEarned, {
  InterestEarnedPeriod,
} from './interest-history/interest-earned';

interface InterestHistoryProps {}

const InterestHistory: React.FunctionComponent<InterestHistoryProps> = ({
  children,
}) => {
  return (
    <Box>
      <section>
        <InterestEarned
          type={InterestEarnedPeriod.TOTAL}
          interestEarned={12313123}
        />
      </section>
      <section>
        <Apy apy={9.37} />
      </section>
    </Box>
  );
};

export default InterestHistory;
