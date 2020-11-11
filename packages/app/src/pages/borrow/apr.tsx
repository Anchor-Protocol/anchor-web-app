import React from 'react'
import Box from '../../components/box'
import BorrowAPRLimitInidicator from './apr/limit-indicator'

interface BorrowAPRProps {
  
}

const BorrowAPR: React.FunctionComponent<BorrowAPRProps> = ({
  children,
}) => {
  return (
    <Box>
      <article>
        <div>
          <header>
            Collateral Value
          </header>
          <div>
            $369.369.00
          </div>
        </div>
        <div>
          <header>
            APR
          </header>
          <div>
            2.60%
          </div>
        </div>
        <div>
          <header>
            Borrowed Value
          </header>
          <div>
            $123,456.00
          </div>
        </div>
      </article>
      <footer>
        <BorrowAPRLimitInidicator
          borrowLimit={1234}
          borrowedValue={5678}
        />
      </footer>
    </Box>
  )
}

export default BorrowAPR