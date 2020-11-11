import React from 'react'
import BorrowAPR from './borrow/apr'
import BorrowCollateralList from './borrow/collateral-list'
import BorrowLoanList from './borrow/loan-list'
import BorrowUnprovidedCollateralList from './borrow/unprovided-collateral-list'

interface BorrowProps {
  
}

const Borrow: React.FunctionComponent<BorrowProps> = ({
  children,
}) => {
  return (
    <main>
      <section>
        <BorrowAPR/>
      </section>
      <section>
        <div>
          <BorrowCollateralList/>
          <BorrowUnprovidedCollateralList/>
        </div>
        <div>
          <BorrowLoanList/>
        </div>
      </section>
    </main>
  )
}

export default Borrow