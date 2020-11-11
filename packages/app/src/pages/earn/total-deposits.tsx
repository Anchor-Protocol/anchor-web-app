import React from 'react'
import Box from '../../components/box'
import Button, { ButtonTypes } from '../../components/button'

interface EarnTotalDepositsProps {
  
}

const EarnTotalDeposits: React.FunctionComponent<EarnTotalDepositsProps> = ({
  children,
}) => {
  return (
    <Box>
      <header>
        Total Deposits
      </header>
      <article>
        1234.5682 UST == 12342353125. aUST
      </article>
      <footer>
        <Button type={ButtonTypes.PRIMARY} transactional={false}>Deposit</Button>
        <Button type={ButtonTypes.DEFAULT} transactional={false}>Withdraw</Button>
      </footer>
    </Box>
  )
}

export default EarnTotalDeposits