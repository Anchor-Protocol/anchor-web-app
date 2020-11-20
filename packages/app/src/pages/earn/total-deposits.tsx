import React, { useState } from 'react'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'
import { ActionContainer } from '../../containers/action'
import PopupContainer from '../../layout/popup-container'
import EarnDepositPopup from './popups/deposit'
import EarnWithdrawPopup from './popups/withdraw'

interface EarnTotalDepositsProps {
  
}

enum PopupStates {
  DEPOSIT,
  WITHDRAW
}

const EarnTotalDeposits: React.FunctionComponent<EarnTotalDepositsProps> = ({
  children,
}) => {
  const [popupState, setPopupState] = useState<PopupStates>()

  return (
    <Box>
      <header>
        Total Deposits
      </header>
      <article>
        1234.5682 UST == 12342353125. aUST
      </article>
      <footer>
        <Button
          type={ButtonTypes.PRIMARY}
          transactional={false}
          onClick={() => setPopupState(PopupStates.DEPOSIT)}
        >Deposit</Button>
        <Button
          type={ButtonTypes.DEFAULT}
          transactional={false}
          onClick={() => setPopupState(PopupStates.WITHDRAW)}
        >Withdraw</Button>
      </footer>

      {popupState === PopupStates.DEPOSIT && (
        <PopupContainer
          onClose={() => setPopupState(undefined)}
          render={close => (
            <EarnDepositPopup close={close} />
          )}>
        </PopupContainer>
      )}

      {popupState === PopupStates.WITHDRAW && (
        <PopupContainer
          onClose={() => setPopupState(undefined)}
          render={close => (
            <EarnWithdrawPopup close={close} />
          )}>
        </PopupContainer>
      )}
    </Box>
  )
}

export default EarnTotalDeposits