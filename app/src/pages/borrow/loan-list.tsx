import React, { useState } from 'react';
import Box from '../../components/box';
import Button, { ButtonTypes } from '../../components/button';
import PopupContainer from '../../layout/popup-container';
import PopupBorrowBorrow from './popups/borrow';
import PopupBorrowRepay from './popups/repay';

interface BorrowLoanListProps {}

enum PopupStates {
  BORROW,
  REPAY,
}

const BorrowLoanList: React.FunctionComponent<BorrowLoanListProps> = () => {
  const [popupState, setPopupState] = useState<PopupStates>();

  return (
    <Box>
      <header>Collateral List</header>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>APY/Accrued</th>
            <th>Borrowed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Terra USD</td>
            <td>
              3.19%
              <br />
              200UST
            </td>
            <td>
              123k UST <br />
              123k USD
            </td>
            <td>
              <Button
                type={ButtonTypes.PRIMARY}
                transactional={false}
                onClick={() => setPopupState(PopupStates.BORROW)}
              >
                Borrow
              </Button>
              <Button
                type={ButtonTypes.DEFAULT}
                transactional={false}
                onClick={() => setPopupState(PopupStates.REPAY)}
              >
                Repay
              </Button>
            </td>
          </tr>
        </tbody>
      </table>

      {popupState === PopupStates.BORROW && (
        <PopupContainer
          onClose={() => setPopupState(undefined)}
          render={(close) => <PopupBorrowBorrow close={close} />}
        />
      )}

      {popupState === PopupStates.REPAY && (
        <PopupContainer
          onClose={() => setPopupState(undefined)}
          render={(close) => <PopupBorrowRepay close={close} />}
        />
      )}
    </Box>
  );
};

export default BorrowLoanList;
