import React, { useState } from 'react';
import Box from 'deprecated/components/box';
import Button, { ButtonTypes } from 'deprecated/components/button';
import { ready } from 'deprecated/components/ready';
import useAnchorBalance from '../../deprecated/hooks/mantle/use-anchor-balance';
import PopupContainer from '../../deprecated/layout/popup-container';
import EarnDepositPopup from './popups/deposit';
import EarnWithdrawPopup from './popups/withdraw';

interface EarnTotalDepositsProps {}

enum PopupStates {
  DEPOSIT,
  WITHDRAW,
}

/** @deprecated */
const EarnTotalDeposits: React.FunctionComponent<EarnTotalDepositsProps> = ({
  children,
}) => {
  const [popupState, setPopupState] = useState<PopupStates>();
  const [loading, error, anchorBalance, r] = useAnchorBalance();

  const isReady = !loading && !error;

  return ready(isReady, () => (
    <Box>
      <header>Total Deposits</header>
      <article>
        1234.5682 UST == {+anchorBalance!.balance / 1000000 || 0} aUST
      </article>
      <footer>
        <Button
          type={ButtonTypes.PRIMARY}
          transactional={false}
          onClick={() => setPopupState(PopupStates.DEPOSIT)}
        >
          Deposit
        </Button>
        <Button
          type={ButtonTypes.DEFAULT}
          transactional={false}
          onClick={() => setPopupState(PopupStates.WITHDRAW)}
        >
          Withdraw
        </Button>
      </footer>

      {popupState === PopupStates.DEPOSIT && (
        <PopupContainer
          onClose={() => {
            r();
            setPopupState(undefined);
          }}
          render={(close) => <EarnDepositPopup close={close} />}
        ></PopupContainer>
      )}

      {popupState === PopupStates.WITHDRAW && (
        <PopupContainer
          onClose={() => setPopupState(undefined)}
          render={(close) => <EarnWithdrawPopup close={close} />}
        ></PopupContainer>
      )}
    </Box>
  ));
};

export default EarnTotalDeposits;
