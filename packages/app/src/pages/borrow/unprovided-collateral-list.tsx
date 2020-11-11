import React from 'react'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'

interface BorrowUnprovidedCollateralList {

}

const BorrowUnprovidedCollateralList: React.FunctionComponent<BorrowUnprovidedCollateralList> = ({
  children,
}) => {
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
              246k UST<br />
              200k bLuna
            </td>
            <td>
              <Button type={ButtonTypes.PRIMARY} transactional={false}>Provide Collateral</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </Box>
  )
}

export default BorrowUnprovidedCollateralList