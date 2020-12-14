import React from 'react';
import InterestHistory from './earn/interest-history';
import EarnTotalDeposits from './earn/total-deposits';
import EarnTransactionHistory from './earn/transaction-history';

interface EarnProps {}

const Earn: React.FunctionComponent<EarnProps> = ({ children }) => {
  return (
    <main>
      <section>
        <div>
          <EarnTotalDeposits />
        </div>
        <div>
          <InterestHistory />
        </div>
      </section>
      <section>
        <EarnTransactionHistory />
      </section>
    </main>
  );
};

export default Earn;
