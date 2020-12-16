import React, { useState } from 'react';
import Box from '../../components/box';
import Button, { ButtonTypes } from '../../components/button';
import PopupContainer from '../../layout/popup-container';
import PopupProvideCollateral from './popups/provide-collateral';

interface BorrowUnprovidedCollateralListProps {}

enum PopupStates {
  PROVIDE,
}

const BorrowUnprovidedCollateralList: React.FunctionComponent<BorrowUnprovidedCollateralListProps> = ({
  children,
}) => {
  const [popupState, setPopupState] = useState<PopupStates>();
  return (
    <Box>
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
                onClick={() => setPopupState(PopupStates.PROVIDE)}
              >
                Provide Collateral
              </Button>
            </td>
          </tr>
        </tbody>
      </table>

      {popupState === PopupStates.PROVIDE && (
        <PopupContainer
          onClose={() => setPopupState(undefined)}
          render={(close) => <PopupProvideCollateral close={close} />}
        />
      )}
    </Box>
  );
};

export default BorrowUnprovidedCollateralList;
