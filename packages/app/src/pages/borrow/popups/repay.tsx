import React from 'react'
import Box from '../../../components/box'
import Button, { ButtonTypes } from '../../../components/button'
import Input from '../../../components/input'

interface PopupBorrowRepayProps {

}

const PopupBorrowRepay: React.FunctionComponent<PopupBorrowRepayProps> = ({
  children,
}) => {
  return (
    <Box>
      <header>
        <dl>
          <dt>Repay</dt>
          <dd>Repay existing UST borrows</dd>
        </dl>
        <p>Borrow APR: 3.19%</p>
      </header>
      <div>
        <section>
          <header>
            Repay Amount
          </header>
          <div>
            <Input textRight="UST" />
          </div>
          <footer>
            Total Borrows: 10721UST
          </footer>
        </section>
        <section>
          <header>
            Borrow Limit Used
          </header>
          <div>
            <Input textRight="%" />
          </div>
        </section>

        {/* indicator */}
        indicator
      </div>

      <footer>
        <Button type={ButtonTypes.PRIMARY} disabled={true}>Proceed</Button>
      </footer>
    </Box>
  )
}

export default PopupBorrowRepay