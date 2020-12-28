import React from 'react';
import InterestHistory from './interest-history';
import EarnTotalDeposits from './total-deposits';
import EarnTransactionHistory from './transaction-history';

interface EarnProps {}

/** @deprecated */
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
