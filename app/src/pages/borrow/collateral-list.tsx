import React, { useState } from 'react';
import Box from 'deprecated/components/box';
import Button, { ButtonTypes } from 'deprecated/components/button';
import PopupContainer from '../../deprecated/layout/popup-container';
import PopupProvideCollateral from './popups/provide-collateral';
import PopupRedeemCollateral from './popups/redeem-collateral';

interface BorrowCollateralListProps {}

enum PopupStates {
  ADD,
  WITHDRAW,
}

const BorrowCollateralList: React.FunctionComponent<BorrowCollateralListProps> = ({
  children,
}) => {
  const [popupState, setPopupState] = useState<PopupStates>();

  return (
    <Box>
      <header>Collateral List</header>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bonded LUNA</td>
            <td>
              246k UST
              <br />
              200k bLuna
            </td>
            <td>
              <Button
                type={ButtonTypes.PRIMARY}
                transactional={false}
                onClick={() => setPopupState(PopupStates.ADD)}
              >
                Add
              </Button>
              <Button
                type={ButtonTypes.DEFAULT}
                transactional={false}
                onClick={() => setPopupState(PopupStates.WITHDRAW)}
              >
                Withdraw
              </Button>
            </td>
          </tr>
        </tbody>
      </table>

      {popupState === PopupStates.ADD && (
        <PopupContainer
          onClose={() => setPopupState(undefined)}
          render={(close) => <PopupProvideCollateral close={close} />}
        />
      )}

      {popupState === PopupStates.WITHDRAW && (
        <PopupContainer
          onClose={() => setPopupState(undefined)}
          render={(close) => <PopupRedeemCollateral close={close} />}
        />
      )}
    </Box>
  );
};

export default BorrowCollateralList;
