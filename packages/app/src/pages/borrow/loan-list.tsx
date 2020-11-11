import React from 'react'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'

interface BorrowLoanList {

}

const BorrowLoanList: React.FunctionComponent<BorrowLoanList> = ({
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
            <th>APY/Accrued</th>
            <th>Borrowed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Terra USD</td>
            <td>
              3.19%<br />
              200UST
            </td>
            <td>
              123k UST <br/>
              123k USD
            </td>
            <td>
              <Button type={ButtonTypes.PRIMARY} transactional={false}>Borrow</Button>
              <Button type={ButtonTypes.DEFAULT} transactional={false}>Repay</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </Box>
  )
}

export default BorrowLoanList