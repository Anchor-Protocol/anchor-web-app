import React from 'react'
import Box from '../../../components/box'
import Button, { ButtonTypes } from '../../../components/button'
import Input from '../../../components/input'

interface PopupBorrowBorrowProps {
  
}

const PopupBorrowBorrow: React.FunctionComponent<PopupBorrowBorrowProps> = ({
  children,
}) => {
  return (
    <Box>
      <header>
        <dl>
          <dt>Borrow</dt>
          <dd>Borrow UST from Anchor</dd>
        </dl>
        <p>Borrow APR: 3.19%</p>
      </header>
      <div>
        <section>
          <header>
            Borrow Amount
          </header>
          <div>
            <Input textRight="UST" />
          </div>
          <footer>
            Safe Max: 10721UST
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

export default PopupBorrowBorrow