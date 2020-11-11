import React from 'react'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'

interface BorrowCollateralListProps {
  
}

const BorrowCollateralList: React.FunctionComponent<BorrowCollateralListProps> = ({
  children,
}) => {
  return (
    <Box>
      <header>
        Collateral List
      </header>
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
              246k UST<br/>
              200k bLuna
            </td>
            <td>
              <Button type={ButtonTypes.PRIMARY} transactional={false}>Add</Button>
              <Button type={ButtonTypes.DEFAULT} transactional={false}>Withdraw</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </Box>
  )
}

export default BorrowCollateralList