import React from 'react';
import Box from 'deprecated/components/box';

interface EarnTransactionHistoryProps {}

/** @deprecated */
const EarnTransactionHistory: React.FunctionComponent<EarnTransactionHistoryProps> = ({
  children,
}) => {
  return (
    <Box>
      <header>Transaction History</header>
      <article>
        <ul>
          <li>
            <aside></aside>
            <article>
              <header>
                <time>16:53, 12 Oct 2020</time>
                <aside>+123,456 UST</aside>
              </header>
              <div>Deposit from terra1...52wpvt</div>
            </article>
          </li>
        </ul>
      </article>
    </Box>
  );
};

export default EarnTransactionHistory;
